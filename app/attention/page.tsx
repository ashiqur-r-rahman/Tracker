import { AppShell } from "@/components/app-shell";
import { AttentionForm } from "@/components/attention-form";
import { createClient } from "@/lib/supabase/server";

export default async function AttentionPage() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("attention_notes").select("id, body, is_resolved, created_at, users_profile(display_name)").order("created_at", { ascending: false });
  return <AppShell><main className="content"><div className="heading"><div><span className="mono">Workspace / Attention</span><h1>Attention</h1><p>Leave a note for the team when something needs a shared response.</p></div></div><AttentionForm /><section className="projects"><div className="panel-title"><h2>Team notes</h2><span className="mono">{notes?.length || 0} notes</span></div>{notes?.length ? <div className="workspace-items">{notes.map((note) => <div className="workspace-item" key={note.id}><b>{note.users_profile?.[0]?.display_name || "Team member"}</b><span>{note.body}</span><small>{new Date(note.created_at).toLocaleString()}</small></div>)}</div> : <p className="empty-state">No attention notes yet.</p>}</section></main></AppShell>;
}