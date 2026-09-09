import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function createClient() {
  const cookieStore = await cookies();
  const config = getSupabasePublicConfig();
  if (!config) throw new Error("Supabase public environment variables are not configured.");
  return createServerClient(
    config.url,
    config.key,
    // Server Components cannot persist refreshed auth cookies. Route handlers do so.
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
}
