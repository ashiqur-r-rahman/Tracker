"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const response = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "Could not create project"); return; }
    router.push(`/projects/${result.project.id}`); router.refresh();
  }
  if (!open) return <button className="primary" onClick={() => setOpen(true)}>Create project</button>;
  return <form className="inline-form" onSubmit={submit}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Project name" required /><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description" /><button className="primary">Create</button>{error && <span className="form-error">{error}</span>}</form>;
}