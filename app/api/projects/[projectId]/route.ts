import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;
  const existing = await supabase.from("projects").select("name").eq("id", projectId).maybeSingle();
  if (!existing.data) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("activity_feed").insert({ actor_id: user.id, verb: "deleted", entity_type: "project", entity_id: projectId, summary: `deleted project ${existing.data.name}` });
  return NextResponse.json({ ok: true });
}

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;
  const [{ data: project, error: projectError }, { data: tasks, error: taskError }] = await Promise.all([
    supabase.from("projects").select("id, name, description, status").eq("id", projectId).maybeSingle(),
    supabase.from("tasks").select("id, task_what, goal, source, source_link, expected_duration_minutes, task_state, completion_summary, created_at").eq("project_id", projectId).order("created_at", { ascending: false }),
  ]);
  if (projectError || taskError) return NextResponse.json({ error: projectError?.message || taskError?.message }, { status: 400 });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json({ project, tasks: tasks || [] });
}