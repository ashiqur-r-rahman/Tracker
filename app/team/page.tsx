import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: members } = await supabase.from("users_profile").select("username, display_name, role, is_active").eq("is_active", true).order("display_name");
  return <AppShell><main className="content"><div className="heading"><div><span className="mono">Workspace / Team</span><h1>Team</h1><p>Active members of this research workspace.</p></div></div><section className="projects"><div className="panel-title"><h2>Members</h2><span className="mono">{members?.length || 0} active</span></div><div className="workspace-items">{members?.map((member) => <div className={`workspace-item user-${member.username}`} key={member.username}><b>{member.username}</b><span>{member.display_name} / {member.role}</span><span className="status done">Active</span></div>)}</div></section></main></AppShell>;
}