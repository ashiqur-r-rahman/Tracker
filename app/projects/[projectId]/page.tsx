import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TaskWorkspace } from "@/components/task-workspace";
import { ProjectActions } from "@/components/project-actions";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient();
  const { projectId } = await params;
  const [{ data: project }, { data: tasks }] = await Promise.all([
    supabase.from("projects").select("id, name, description").eq("id", projectId).maybeSingle(),
    supabase.from("tasks").select("id, task_what, goal, source, source_link, expected_duration_minutes, task_state, completion_summary").eq("project_id", projectId).order("created_at", { ascending: false }),
  ]);
  if (!project) notFound();
  return <AppShell><main className="content"><div className="heading"><div><span className="mono">Workspace / Projects / Project</span><h1>{project.name}</h1><p>{project.description || "No description yet."}</p></div><ProjectActions projectId={projectId} /></div><TaskWorkspace projectId={projectId} tasks={(tasks || []) as never[]} /></main></AppShell>;
}