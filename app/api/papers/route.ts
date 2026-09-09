import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("papers").select("id, title, topic, doi, download_link, created_at, users_profile(display_name)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ papers: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  const doi = typeof body?.doi === "string" ? body.doi.trim() : "";
  const downloadLink = typeof body?.download_link === "string" ? body.download_link.trim() : null;
  if (!title || !topic || !doi) return NextResponse.json({ error: "Paper title, topic, and DOI are required" }, { status: 400 });
  if (downloadLink) { try { const url = new URL(downloadLink); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { return NextResponse.json({ error: "Download link must be a valid HTTP or HTTPS URL" }, { status: 400 }); } }
  const { data, error } = await supabase.from("papers").insert({ title, topic, doi, download_link: downloadLink, created_by: user.id }).select("id, title, topic, doi, download_link, created_at").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "A paper with this DOI already exists" : error.message }, { status: 400 });
  await supabase.from("activity_feed").insert({ actor_id: user.id, verb: "added", entity_type: "paper", entity_id: data.id, summary: `added paper ${data.title}` });
  return NextResponse.json({ paper: data }, { status: 201 });
}