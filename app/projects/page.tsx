import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProjectForm } from "@/components/project-form";
import { createClient } from "@/lib/supabase/server";
import { getUsername } from "@/lib/profile";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("id, name, description, status, users_profile!projects_owner_id_fkey(display_name, username)").order("updated_at", { ascending: false });
  return <AppShell><main className="content"><div className="heading"><div><span className="mono">Workspace / Projects</span><h1>Projects</h1><p>All projects are shared with the workspace.</p></div><ProjectForm /></div><section className="projects"><div className="panel-title"><h2>All projects</h2><span className="mono">{projects?.length || 0} projects</span></div>{projects?.length ? <div className="workspace-items">{projects.map((project) => { const username = getUsername(project.users_profile); return <Link className={`workspace-item user-${username}`} href={`/projects/${project.id}`} key={project.id}><b>{project.name}</b><span>{project.description || "No description yet"}</span><span>Created by {username} -&gt;</span></Link>; })}</div> : <p className="empty-state">No projects yet. Create the first project to begin.</p>}</section></main></AppShell>;
}