"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bell, BookOpen, CalendarDays, Home, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Logo } from "@/components/Logo";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Routine", href: "/routine", icon: CalendarDays },
  { label: "Student", href: "/student", icon: UserRound },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Alerts", href: "/alerts", icon: Bell },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { teacher, ready, logout } = useAuth();
  const { dark, toggleDark } = useTheme();

  useEffect(() => {
    if (pathname !== "/login" && ready && !teacher) router.replace("/login");
  }, [pathname, ready, router, teacher]);

  if (pathname === "/login") return <>{children}</>;

  if (!ready || !teacher) {
    return <div className="grid min-h-screen place-items-center text-[var(--muted)]">Loading Smart Routine Hub...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-200/70 bg-[var(--surface)] px-5 py-6 shadow-sm dark:border-white/10 lg:flex">
        <Logo />
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-500/12 text-emerald-600 shadow-sm dark:text-emerald-300"
                    : "text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">PS</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--text)]">{teacher.name}</p>
              <p className="truncate text-xs text-[var(--muted)]">{teacher.department}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] shadow-sm dark:bg-slate-950/30" onClick={toggleDark}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              Theme
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white" onClick={logout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="pb-24 lg:ml-72 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-[var(--surface)] px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] dark:border-white/10 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold ${active ? "text-emerald-600" : "text-[var(--muted)]"}`}>
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
