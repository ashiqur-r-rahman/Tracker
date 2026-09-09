"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AttentionForm() { const router = useRouter(); const [body, setBody] = useState(""); const [error, setError] = useState(""); async function submit(event: React.FormEvent) { event.preventDefault(); const response = await fetch("/api/attention-notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) }); const result = await response.json(); if (!response.ok) { setError(result.error || "Could not save note"); return; } setBody(""); setError(""); router.refresh(); } return <form className="attention-form" onSubmit={submit}><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What needs the team's attention?" required /><button className="primary">Leave note</button>{error && <span className="form-error">{error}</span>}</form>; }