import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const states = new Set(["todo", "running", "done"]);

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;
  const body = await request.json().catch(() => null);
  const taskWhat = typeof body?.task_what === "string" ? body.task_what.trim() : "";
  const taskState = typeof body?.task_state === "string" ? body.task_state : "todo";
  const duration = body?.expected_duration_minutes === "" || body?.expected_duration_minutes == null ? null : Number(body.expected_duration_minutes);
  if (!taskWhat) return NextResponse.json({ error: "What task is required" }, { status: 400 });
  if (!states.has(taskState)) return NextResponse.json({ error: "Invalid task state" }, { status: 400 });
  if (duration !== null && (!Number.isInteger(duration) || duration < 0)) return NextResponse.json({ error: "Expected duration must be a non-negative number of minutes" }, { status: 400 });
  if (taskState === "done" && !(typeof body?.completion_summary === "string" && body.completion_summary.trim())) return NextResponse.json({ error: "Completion summary is required for done tasks" }, { status: 400 });
  const sourceLink = typeof body?.source_link === "string" ? body.source_link.trim() : null;
  if (sourceLink) { try { const url = new URL(sourceLink); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { return NextResponse.json({ error: "Source link must be a valid HTTP or HTTPS URL" }, { status: 400 }); } }
  const { data, error } = await supabase.from("tasks").insert({ project_id: projectId, title: taskWhat, description: body.goal?.trim() || null, task_what: taskWhat, goal: body.goal?.trim() || null, source: body.source?.trim() || null, source_link: sourceLink, expected_duration_minutes: duration, task_state: taskState, completion_summary: body.completion_summary?.trim() || null, created_by: user.id }).select("id, task_what, goal, source, source_link, expected_duration_minutes, task_state, completion_summary, created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("activity_feed").insert({ actor_id: user.id, verb: "created", entity_type: "task", entity_id: data.id, project_id: projectId, summary: `created task ${taskWhat}` });
  return NextResponse.json({ task: data }, { status: 201 });
}