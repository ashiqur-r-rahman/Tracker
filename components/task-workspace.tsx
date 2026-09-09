"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Task = { id: string; task_what: string; goal: string | null; source: string | null; source_link: string | null; expected_duration_minutes: number | null; task_state: "todo" | "running" | "done"; completion_summary: string | null };
const groups: Task["task_state"][] = ["todo", "running", "done"];

export function TaskWorkspace({ projectId, tasks }: { projectId: string; tasks: Task[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [summaryTask, setSummaryTask] = useState<Task | null>(null);
  async function advance(task: Task, completion_summary?: string) {
    const task_state = task.task_state === "todo" ? "running" : "done";
    const response = await fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_state, completion_summary }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "Could not update task"); return; }
    setSummaryTask(null); router.refresh();
  }
  async function remove(task: Task) {
    if (!window.confirm(`Delete task "${task.task_what}"?`)) return;
    const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (!response.ok) { setError("Could not delete task"); return; }
    router.refresh();
  }
  return <section className="projects task-workspace"><div className="panel-title"><h2>My tasks</h2><button onClick={() => setAdding(!adding)}>{adding ? "Close" : "Add task"}</button></div>{adding && <TaskForm projectId={projectId} onDone={() => { setAdding(false); router.refresh(); }} />}{error && <p className="form-error">{error}</p>}<div className="task-columns">{groups.map((state) => <div className="task-column" key={state}><h3 className={`task-heading ${state}`}>{state}</h3>{tasks.filter((task) => task.task_state === state).map((task) => <article className="task-card" key={task.id}><button className="delete-icon" aria-label={`Delete ${task.task_what}`} title="Delete task" onClick={() => remove(task)}>x</button><b>{task.task_what}</b>{task.goal && <p>{task.goal}</p>}<small>{task.source || "No source"}{task.expected_duration_minutes ? ` / ${task.expected_duration_minutes} min` : ""}</small>{task.completion_summary && <em>Summary: {task.completion_summary}</em>}{state !== "done" && <button onClick={() => state === "running" ? setSummaryTask(task) : advance(task)}>{state === "todo" ? "Start running" : "Mark done"}</button>}</article>)}</div>)}</div>{summaryTask && <CompletionForm task={summaryTask} onSubmit={(summary) => advance(summaryTask, summary)} onCancel={() => setSummaryTask(null)} />}</section>;
}

function TaskForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [form, setForm] = useState({ task_what: "", goal: "", source: "", source_link: "", expected_duration_minutes: "" });
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) { event.preventDefault(); const response = await fetch(`/api/projects/${projectId}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const result = await response.json(); if (!response.ok) { setError(result.error || "Could not add task"); return; } onDone(); }
  return <form className="task-form" onSubmit={submit}>{(["task_what", "goal", "source", "source_link", "expected_duration_minutes"] as const).map((field) => <input key={field} required={field === "task_what"} type={field === "expected_duration_minutes" ? "number" : field === "source_link" ? "url" : "text"} placeholder={field.replaceAll("_", " ")} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}<button className="primary">Add task</button>{error && <span className="form-error">{error}</span>}</form>;
}

function CompletionForm({ task, onSubmit, onCancel }: { task: Task; onSubmit: (summary: string) => void; onCancel: () => void }) { const [summary, setSummary] = useState(""); return <form className="completion-form" onSubmit={(event) => { event.preventDefault(); onSubmit(summary); }}><b>How was “{task.task_what}” completed?</b><textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Write a task summary" required /><button className="primary">Save and mark done</button><button type="button" onClick={onCancel}>Cancel</button></form>; }