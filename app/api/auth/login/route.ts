import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (typeof username !== "string" || typeof password !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const config = getSupabasePublicConfig();
  if (!config) return NextResponse.json({ error: "Authentication is not configured" }, { status: 503 });
  const response = NextResponse.json({ ok: true });
  const supabase = createServerClient(config.url, config.key, {
    cookies: { getAll: () => request.cookies.getAll(), setAll(cookies: { name: string; value: string; options: CookieOptions }[]) { cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } },
  });
  const email = `${username.trim().toLowerCase()}@internal.meridian.local`;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  return response;
}
