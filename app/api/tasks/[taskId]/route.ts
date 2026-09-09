import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId } = await params;
  const body = await request.json().catch(() => null);
  const nextState = body?.task_state;
  if (!["todo", "running", "done"].includes(nextState)) return NextResponse.json({ error: "Invalid task state" }, { status: 400 });
  const current = await supabase.from("tasks").select("task_state").eq("id", taskId).maybeSingle();
  if (current.error || !current.data) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  const allowed = (current.data.task_state === "todo" && nextState === "running") || (current.data.task_state === "running" && nextState === "done");
  if (!allowed) return NextResponse.json({ error: "Tasks can only move todo to running and running to done" }, { status: 400 });
  const summary = typeof body?.completion_summary === "string" ? body.completion_summary.trim() : "";
  if (nextState === "done" && !summary) return NextResponse.json({ error: "Completion summary is required" }, { status: 400 });
  const { data, error } = await supabase.from("tasks").update({ task_state: nextState, completion_summary: nextState === "done" ? summary : null, updated_at: new Date().toISOString() }).eq("id", taskId).select("id, project_id, task_what, task_state, completion_summary").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("activity_feed").insert({ actor_id: user.id, verb: "updated", entity_type: "task", entity_id: data.id, project_id: data.project_id, summary: `moved task ${data.task_what} to ${data.task_state}` });
  return NextResponse.json({ task: data });
}