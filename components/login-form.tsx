"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function signIn(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: String(form.get("username")), password: String(form.get("password")) }) }); setLoading(false); if (!response.ok) setError("That username or password isn't right."); else window.location.assign("/"); }
  return <form onSubmit={signIn} className="login-form">{error && <p role="alert" className="form-error">{error}</p>}<label>Username<input name="username" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><label className="check"><input type="checkbox" name="staySignedIn" />Stay signed in on this device</label><button className="primary" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form>;
}
