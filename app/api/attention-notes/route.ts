import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("attention_notes").select("id, body, is_resolved, created_at, author_id, users_profile(display_name)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notes: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const note = typeof body?.body === "string" ? body.body.trim() : "";
  if (!note) return NextResponse.json({ error: "Note is required" }, { status: 400 });
  const { data, error } = await supabase.from("attention_notes").insert({ body: note, author_id: user.id }).select("id, body, is_resolved, created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ note: data }, { status: 201 });
}