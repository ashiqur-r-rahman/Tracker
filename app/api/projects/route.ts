import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("projects").select("id, name, description, status, updated_at").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : null;
  if (!name) return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  const { data: project, error } = await supabase.from("projects").insert({ name, description, owner_id: user.id }).select("id, name, description, status").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const membership = await supabase.from("project_members").insert({ project_id: project.id, user_id: user.id, project_role: "lead" });
  if (membership.error) return NextResponse.json({ error: membership.error.message }, { status: 400 });
  await supabase.from("activity_feed").insert({ actor_id: user.id, verb: "created", entity_type: "project", entity_id: project.id, project_id: project.id, summary: `created project ${project.name}` });
  return NextResponse.json({ project }, { status: 201 });
}