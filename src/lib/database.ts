import { neon } from "@neondatabase/serverless";

let sqlClient: ReturnType<typeof neon> | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL non configurata: l'app sta usando la modalità demo.");
  }

  if (!sqlClient) sqlClient = neon(databaseUrl);
  return sqlClient;
}
