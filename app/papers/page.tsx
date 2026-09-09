import { AppShell } from "@/components/app-shell";
import { PaperForm } from "@/components/paper-form";
import { createClient } from "@/lib/supabase/server";
import { getUsername } from "@/lib/profile";

export default async function PapersPage() {
  const supabase = await createClient();
  const { data: papers } = await supabase.from("papers").select("id, title, topic, doi, download_link, created_at, users_profile(display_name, username)").order("created_at", { ascending: false });
  return <AppShell><main className="content"><div className="heading"><div><span className="mono">Workspace / Papers</span><h1>Papers</h1><p>Shared papers for the whole research team.</p></div></div><PaperForm /><section className="projects"><div className="panel-title"><h2>Team papers</h2><span className="mono">{papers?.length || 0} papers</span></div>{papers?.length ? <div className="workspace-items">{papers.map((paper) => { const name = getUsername(paper.users_profile); return <article className={`workspace-item paper-item user-${name}`} key={paper.id}><b>{paper.title}</b><span>{paper.topic} / DOI: {paper.doi}</span><span>Added by {name} {paper.download_link ? <a href={paper.download_link} target="_blank" rel="noreferrer">Download</a> : ""}</span></article>; })}</div> : <p className="empty-state">No papers yet. Add the first paper for the team.</p>}</section></main></AppShell>;
}