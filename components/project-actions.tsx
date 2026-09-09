"use client";

import { useRouter } from "next/navigation";

export function ProjectActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  async function remove() {
    if (!window.confirm("Delete this project and all of its tasks?")) return;
    const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (response.ok) router.push("/projects");
  }
  return <button className="danger-button" onClick={remove}>Delete project</button>;
}