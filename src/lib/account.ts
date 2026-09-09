import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";

export const accountCookieName = "r10-account-session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 365;
let accountSchemaPromise: Promise<unknown> | null = null;

export function normalizeSyncCode(value: unknown) {
  return typeof value === "string" ? value.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 32) : "";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function cleanDisplayName(value: unknown) {
  if (typeof value !== "string") return "Fotografo";
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, 40);
  return cleaned || "Fotografo";
}

export function createSyncCode() {
  const raw = randomBytes(10).toString("hex");
  return raw.match(/.{1,5}/g)?.join("-").toUpperCase() ?? raw.toUpperCase();
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export async function ensureAccountTables() {
  if (!accountSchemaPromise) {
    const sql = getDatabase();
    accountSchemaPromise = (async () => {
      await sql`create table if not exists coach_accounts (
        id uuid primary key,
        display_name text not null,
        sync_code_hash text not null unique,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )`;
      await sql`create table if not exists coach_account_states (
        account_id uuid primary key references coach_accounts(id) on delete cascade,
        state jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )`;
      await sql`create table if not exists coach_sessions (
        session_hash text primary key,
        account_id uuid not null references coach_accounts(id) on delete cascade,
        expires_at timestamptz not null,
        created_at timestamptz not null default now()
      )`;
    })().catch((error) => {
      accountSchemaPromise = null;
      throw error;
    });
  }
  await accountSchemaPromise;
}

export async function createAccount(displayName: string) {
  await ensureAccountTables();
  const sql = getDatabase();
  const id = randomUUID();
  const syncCode = createSyncCode();
  await sql`insert into coach_accounts (id, display_name, sync_code_hash)
    values (${id}::uuid, ${cleanDisplayName(displayName)}, ${digest(normalizeSyncCode(syncCode))})`;
  return { id, syncCode };
}

export async function findAccountBySyncCode(syncCode: string) {
  await ensureAccountTables();
  const sql = getDatabase();
  const normalized = normalizeSyncCode(syncCode);
  if (normalized.length !== 20) return null;
  const rows = await sql`select id, display_name from coach_accounts where sync_code_hash = ${digest(normalized)} limit 1` as unknown as Array<{ id: string; display_name: string }>;
  return rows[0] ?? null;
}

export async function getAccount(request: NextRequest) {
  const token = request.cookies.get(accountCookieName)?.value;
  if (!token) return null;
  await ensureAccountTables();
  const sql = getDatabase();
  const rows = await sql`select a.id, a.display_name
    from coach_sessions s join coach_accounts a on a.id = s.account_id
    where s.session_hash = ${digest(token)} and s.expires_at > now() limit 1` as unknown as Array<{ id: string; display_name: string }>;
  return rows[0] ?? null;
}

export async function startSession(response: NextResponse, accountId: string) {
  const token = createSessionToken();
  const sql = getDatabase();
  await sql`delete from coach_sessions where expires_at <= now()`;
  await sql`insert into coach_sessions (session_hash, account_id, expires_at)
    values (${digest(token)}, ${accountId}::uuid, now() + interval '1 year')`;
  response.cookies.set(accountCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export function endSession(response: NextResponse) {
  response.cookies.set(accountCookieName, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}
