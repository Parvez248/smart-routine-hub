"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarCheck, Grid2X2, List, Megaphone, Plus, RotateCcw, Shapes, Sparkles } from "lucide-react";
import { ClassCard } from "@/components/ClassCard";
import { StatCard } from "@/components/StatCard";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useClasses } from "@/context/ClassesContext";
import { days, programs, rooms, semesters } from "@/data/seed";
import { classStats } from "@/lib/stats";

export default function DashboardPage() {
  const { teacher, logout } = useAuth();
  const { classes, deleteClass } = useClasses();
  const [filters, setFilters] = useState({ semester: "", program: "", room: "", day: "" });
  const [view, setView] = useState<"grid" | "list">("grid");
  const stats = classStats(classes);

  const filteredClasses = useMemo(
    () =>
      classes.filter((item) =>
        (!filters.semester || item.semester === filters.semester) &&
        (!filters.program || item.program === filters.program) &&
        (!filters.room || item.room === filters.room) &&
        (!filters.day || item.day === filters.day)
      ),
    [classes, filters],
  );

  return (
    <>
      <TopBar title="Dashboard" subtitle="Manage your classes and keep the official routine close." />
      <section className="mb-6 overflow-hidden rounded-2xl bg-[image:var(--brand-gradient)] p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold opacity-90">Welcome back,</p>
            <h2 className="font-[var(--font-poppins)] text-3xl font-bold">{teacher?.name}</h2>
            <p className="mt-2 text-sm font-medium text-white/85">{teacher?.role} · {teacher?.department}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/add-class" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-sm">
              <Plus size={18} /> Add class
            </Link>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/25">
              <Megaphone size={18} /> Announcement
            </button>
            <button onClick={logout} className="rounded-xl bg-slate-950/20 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/20">Logout</button>
          </div>
        </div>
      </section>
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Today" value={stats.today} icon={CalendarCheck} tone="bg-gradient-to-br from-pink-500 to-pink-400" />
        <StatCard label="This Week" value={stats.thisWeek} icon={Sparkles} tone="bg-gradient-to-br from-blue-500 to-cyan-400" />
        <StatCard label="Courses" value={stats.courses} icon={Shapes} tone="bg-gradient-to-br from-emerald-500 to-emerald-400" />
      </section>
      <section className="mb-6 rounded-2xl bg-[var(--surface)] p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-[var(--font-poppins)] text-xl font-bold">Filter Classes</h2>
            <p className="text-sm text-[var(--muted)]">Showing <strong>{filteredClasses.length}</strong> classes</p>
          </div>
          <button onClick={() => setFilters({ semester: "", program: "", room: "", day: "" })} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
            <RotateCcw size={16} /> Reset Filters
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Semester" value={filters.semester} options={semesters} onChange={(value) => setFilters((current) => ({ ...current, semester: value }))} />
          <Select label="Program" value={filters.program} options={programs} onChange={(value) => setFilters((current) => ({ ...current, program: value }))} />
          <Select label="Room" value={filters.room} options={rooms} onChange={(value) => setFilters((current) => ({ ...current, room: value }))} />
          <Select label="Day" value={filters.day} options={days} onChange={(value) => setFilters((current) => ({ ...current, day: value }))} />
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-[var(--font-poppins)] text-2xl font-bold">Your Classes</h2>
          <div className="flex rounded-2xl bg-[var(--surface)] p-1 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
            <button aria-label="Grid view" onClick={() => setView("grid")} className={`grid h-10 w-10 place-items-center rounded-xl ${view === "grid" ? "bg-emerald-500 text-white" : "text-[var(--muted)]"}`}><Grid2X2 size={18} /></button>
            <button aria-label="List view" onClick={() => setView("list")} className={`grid h-10 w-10 place-items-center rounded-xl ${view === "list" ? "bg-emerald-500 text-white" : "text-[var(--muted)]"}`}><List size={18} /></button>
          </div>
        </div>
        <div className={view === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
          {filteredClasses.map((item) => <ClassCard key={item.id} item={item} compact={view === "list"} onDelete={deleteClass} />)}
        </div>
      </section>
    </>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-[var(--text)] dark:border-white/10 dark:bg-white/5">
        <option value="">All {label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
