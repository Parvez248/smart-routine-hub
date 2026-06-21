"use client";

import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { teacher } = useAuth();
  const { dark, toggleDark } = useTheme();

  return (
    <header className="no-print mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Smart Routine Hub</p>
        <h1 className="font-[var(--font-poppins)] text-3xl font-bold text-[var(--text)]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Toggle dark mode" onClick={toggleDark} className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--text)] shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-500 font-bold text-white">{teacher?.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
      </div>
    </header>
  );
}
