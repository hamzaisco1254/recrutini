"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null as { error?: string } | null);

  return (
    <form action={action} className="card" style={{ padding: 26, display: "grid", gap: 16 }}>
      <div>
        <label className="lbl">Email</label>
        <input className="field" name="email" type="email" required autoFocus />
      </div>
      <div>
        <label className="lbl">Password</label>
        <input className="field" name="password" type="password" required />
      </div>
      {state?.error && (
        <div style={{ fontSize: 14.5, color: "#8A3B3B" }}>{state.error}</div>
      )}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Checking..." : "Sign in"}
      </button>
    </form>
  );
}
