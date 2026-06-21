"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("palash@hub.edu");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!login(email, password)) setError("Enter any email and password to use the demo.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-[var(--surface)] p-8 shadow-xl ring-1 ring-slate-200/70 dark:ring-white/10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 font-[var(--font-poppins)] text-3xl font-bold text-[var(--text)]">Teacher Login</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Demo: any email and password opens Palash Shah's dashboard.</p>
        </div>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Email</span>
          <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <Mail size={18} className="text-[var(--muted)]" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent outline-none" type="email" placeholder="palash@hub.edu" />
          </span>
        </label>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Password</span>
          <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <Lock size={18} className="text-[var(--muted)]" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent outline-none" type="password" placeholder="Any password" />
          </span>
        </label>
        <label className="mb-5 flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
          <input type="checkbox" className="h-4 w-4 accent-emerald-500" defaultChecked />
          Remember me
        </label>
        {error && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-950/30">{error}</p>}
        <button className="w-full rounded-xl bg-[image:var(--brand-gradient)] px-5 py-3 font-bold text-white shadow-lg shadow-emerald-500/20">Log in</button>
      </form>
    </main>
  );
}
