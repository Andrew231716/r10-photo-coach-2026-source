import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase, hasDatabase } from "@/lib/database";
import { defaultAppState, normalizeAppState } from "@/lib/app-state";
import { getAccount } from "@/lib/account";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cookieName = "r10-device";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let schemaPromise: Promise<unknown> | null = null;

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

function getDeviceId(request: NextRequest) {
  const current = request.cookies.get(cookieName)?.value;
  return current && uuidPattern.test(current) ? current : randomUUID();
}

function setDeviceCookie(response: NextResponse, deviceId: string) {
  response.cookies.set(cookieName, deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

async function ensureStateTable() {
  if (!schemaPromise) {
    const sql = getDatabase();
    schemaPromise = sql`
      create table if not exists device_states (
        device_id uuid primary key,
        state jsonb not null default '{"academyCompleted":[],"tutorialsCompleted":[],"ownedGear":[],"updatedAt":0}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `.catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

export async function GET(request: NextRequest) {
  if (!hasDatabase()) {
    return noStore(NextResponse.json({ mode: "local", found: false, state: null }));
  }

  try {
    await ensureStateTable();
    const sql = getDatabase();
    const account = await getAccount(request);
    if (account) {
      const accountRows = await sql`select state from coach_account_states where account_id = ${account.id}::uuid limit 1` as unknown as Array<{ state?: unknown }>;
      const accountRow = accountRows[0];
      return noStore(NextResponse.json({ mode: "database", account: true, found: Boolean(accountRow), state: accountRow ? normalizeAppState(accountRow.state) : defaultAppState }));
    }
    const deviceId = getDeviceId(request);
    const rows = await sql`select state from device_states where device_id = ${deviceId}::uuid limit 1` as unknown as Array<{ state?: unknown }>;
    const row = rows[0];
    const response = NextResponse.json({
      mode: "database",
      found: Boolean(row),
      state: row ? normalizeAppState(row.state) : defaultAppState,
    });
    setDeviceCookie(response, deviceId);
    return noStore(response);
  } catch {
    return noStore(NextResponse.json({ mode: "local", found: false, state: null, error: "database_unavailable" }, { status: 503 }));
  }
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get("origin");
  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin) {
    try {
      if (!requestHost || new URL(origin).host !== requestHost) {
        return noStore(NextResponse.json({ error: "origin_not_allowed" }, { status: 403 }));
      }
    } catch {
      return noStore(NextResponse.json({ error: "origin_not_allowed" }, { status: 403 }));
    }
  }
  if (!hasDatabase()) {
    return noStore(NextResponse.json({ mode: "local", saved: false }, { status: 503 }));
  }

  try {
    const body = await request.json() as { state?: unknown };
    if (!body || !("state" in body)) {
      return noStore(NextResponse.json({ error: "invalid_state" }, { status: 400 }));
    }

    const state = normalizeAppState(body.state);
    const serializedState = JSON.stringify(state);
    await ensureStateTable();
    const sql = getDatabase();
    const account = await getAccount(request);
    if (account) {
      await sql`insert into coach_account_states (account_id, state)
        values (${account.id}::uuid, ${serializedState}::jsonb)
        on conflict (account_id) do update set state = excluded.state, updated_at = now()`;
      return noStore(NextResponse.json({ mode: "database", account: true, saved: true, state }));
    }
    const deviceId = getDeviceId(request);
    await sql`
      insert into device_states (device_id, state)
      values (${deviceId}::uuid, ${serializedState}::jsonb)
      on conflict (device_id) do update
      set state = excluded.state, updated_at = now()
    `;

    const response = NextResponse.json({ mode: "database", saved: true, state });
    setDeviceCookie(response, deviceId);
    return noStore(response);
  } catch {
    return noStore(NextResponse.json({ mode: "local", saved: false, error: "database_unavailable" }, { status: 503 }));
  }
}
