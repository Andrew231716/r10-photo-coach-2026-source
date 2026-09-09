import { NextRequest, NextResponse } from "next/server";
import { cleanDisplayName, createAccount, endSession, findAccountBySyncCode, getAccount, startSession } from "@/lib/account";
import { normalizeAppState } from "@/lib/app-state";
import { getDatabase, hasDatabase } from "@/lib/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export async function GET(request: NextRequest) {
  if (!hasDatabase()) return noStore(NextResponse.json({ mode: "local", account: null }));
  try {
    const account = await getAccount(request);
    return noStore(NextResponse.json({ mode: "database", account: account ? { id: account.id, displayName: account.display_name } : null }));
  } catch {
    return noStore(NextResponse.json({ mode: "local", account: null, error: "database_unavailable" }, { status: 503 }));
  }
}

export async function POST(request: NextRequest) {
  if (!hasDatabase()) return noStore(NextResponse.json({ error: "database_required" }, { status: 503 }));
  try {
    const body = await request.json() as { action?: string; displayName?: unknown; syncCode?: unknown; state?: unknown };
    if (body.action === "signout") {
      const response = NextResponse.json({ ok: true });
      endSession(response);
      return noStore(response);
    }

    if (body.action === "create") {
      const account = await createAccount(cleanDisplayName(body.displayName));
      const sql = getDatabase();
      const state = normalizeAppState(body.state);
      await sql`insert into coach_account_states (account_id, state) values (${account.id}::uuid, ${JSON.stringify(state)}::jsonb)`;
      const response = NextResponse.json({ ok: true, displayName: cleanDisplayName(body.displayName), syncCode: account.syncCode });
      await startSession(response, account.id);
      return noStore(response);
    }

    if (body.action === "signin") {
      const account = await findAccountBySyncCode(String(body.syncCode ?? ""));
      if (!account) return noStore(NextResponse.json({ error: "invalid_sync_code" }, { status: 401 }));
      const response = NextResponse.json({ ok: true, displayName: account.display_name });
      await startSession(response, account.id);
      return noStore(response);
    }

    return noStore(NextResponse.json({ error: "invalid_action" }, { status: 400 }));
  } catch {
    return noStore(NextResponse.json({ error: "database_unavailable" }, { status: 503 }));
  }
}
