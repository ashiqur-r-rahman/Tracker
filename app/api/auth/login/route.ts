import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (typeof username !== "string" || typeof password !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const response = NextResponse.json({ ok: true });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll(cookies: { name: string; value: string; options: CookieOptions }[]) { cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } },
  });
  const email = `${username.trim().toLowerCase()}@internal.meridian.local`;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  return response;
}
