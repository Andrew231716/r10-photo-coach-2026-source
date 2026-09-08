import { getDatabase, hasDatabase } from "@/lib/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  if (!hasDatabase()) {
    return Response.json(
      { status: "degraded", database: "not_configured" },
      { status: 503, headers: noStoreHeaders },
    );
  }

  try {
    const sql = getDatabase();
    await sql`select 1 as ok`;

    return Response.json(
      { status: "ok", database: "connected" },
      { headers: noStoreHeaders },
    );
  } catch {
    return Response.json(
      { status: "error", database: "unreachable" },
      { status: 503, headers: noStoreHeaders },
    );
  }
}
