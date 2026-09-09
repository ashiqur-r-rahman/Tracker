import { readFile } from "node:fs/promises";
import postgres from "postgres";

const connectionString = process.env.MERIDIAN_DATABASE_URL;
if (!connectionString) throw new Error("MERIDIAN_DATABASE_URL is not configured.");

const migrationFile = process.argv[2] ?? "0001_meridian_core.sql";
if (!/^\d{4}_[a-z0-9_]+\.sql$/.test(migrationFile)) throw new Error("Invalid migration filename.");
const migration = await readFile(new URL(`../supabase/migrations/${migrationFile}`, import.meta.url), "utf8");
const sql = postgres(connectionString, { ssl: "require", max: 1 });

try {
  await sql.unsafe(migration);
  console.log("Meridian core migration applied.");
} finally {
  await sql.end();
}
