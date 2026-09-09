import { LoginForm } from "@/components/login-form";

export default function LoginPage() { return <main className="login-page"><section className="login-card"><div className="brand"><span className="mark" />Meridian</div><h1>Sign in</h1><p>Use your workspace username and password.</p><LoginForm /><small>Trouble signing in? Contact your workspace admin.</small></section></main>; }
