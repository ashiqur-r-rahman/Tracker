"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PaperForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", topic: "", doi: "", download_link: "" });
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/papers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "Could not add paper"); return; }
    setForm({ title: "", topic: "", doi: "", download_link: "" }); setError(""); router.refresh();
  }
  return <form className="paper-form" onSubmit={submit}>{(["title", "topic", "doi", "download_link"] as const).map((field) => <input key={field} required={field !== "download_link"} type={field === "download_link" ? "url" : "text"} placeholder={`${field.replaceAll("_", " ")}${field === "download_link" ? " (optional)" : ""}`} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}<button className="primary">Add paper</button>{error && <span className="form-error">{error}</span>}</form>;
}