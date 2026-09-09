import postgres from "postgres";

const sql = postgres(process.env.MERIDIAN_DATABASE_URL, { ssl: "require", max: 1 });
try {
  const tables = await sql`
    select tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
      and tablename in ('users_profile','projects','project_members','tasks','materials','notes','references','reports','comments','audit_log','attention_notes','papers')
    order by tablename`;
  if (tables.length !== 12 || tables.some((table) => !table.rowsecurity)) throw new Error("Core tables or RLS verification failed.");
  console.log(`Verified ${tables.length} core tables with Row Level Security enabled.`);
} finally { await sql.end(); }
