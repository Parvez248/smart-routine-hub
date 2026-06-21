"use client";

import { Fragment, useMemo, useState } from "react";
import { Download, Filter, Users } from "lucide-react";
import routine from "@/data/routine-data.json";
import { TopBar } from "@/components/TopBar";
import type { RoutineSession } from "@/lib/types";

const bandColors: Record<string, string> = {
  "1st": "#475569",
  "2nd": "#475569",
  "3rd": "#6D5DD3",
  "4th": "#6D5DD3",
  "5th": "#0E9F8E",
  "6th": "#0E9F8E",
  "7th": "#1F7A4D",
  "8th": "#1F7A4D",
};

const bandLabels = {
  first: ["1st", "2nd"],
  second: ["3rd", "4th"],
  third: ["5th", "6th"],
  fourth: ["7th", "8th"],
};

function rowKey(session: RoutineSession) {
  return `${session.batch}-${session.semester}-${session.section ?? "All"}`;
}

function rowLabel(key: string) {
  const [batch, semester, section] = key.split("-");
  return `${batch} / ${semester}${section !== "All" ? ` · ${section}` : ""}`;
}

function sortRows(keys: string[]) {
  return [...keys].sort((a, b) => Number.parseInt(b.split("-")[1]) - Number.parseInt(a.split("-")[1]) || a.localeCompare(b));
}

export default function RoutinePage() {
  const [dayFilter, setDayFilter] = useState("");
  const [bandFilter, setBandFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);

  const todayRoutineDay = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date()).replace("Tue", "Tues");
  const batches = Array.from(new Set(routine.sessions.map((session) => `${session.batch} / ${session.semester}`)));
  const teacherEntries = Object.entries(routine.teachers).sort((a, b) => a[0].localeCompare(b[0]));

  const filteredSessions = useMemo(() => {
    return (routine.sessions as RoutineSession[]).filter((session) => {
      const bandMatch = !bandFilter || bandLabels[bandFilter as keyof typeof bandLabels].includes(session.semester);
      const batchMatch = !batchFilter || `${session.batch} / ${session.semester}` === batchFilter;
      const dayMatch = !dayFilter || session.day === dayFilter;
      const todayMatch = !todayOnly || session.day === todayRoutineDay;
      const teacherMatch = !teacherFilter || session.teacher === teacherFilter;
      return bandMatch && batchMatch && dayMatch && todayMatch && teacherMatch;
    });
  }, [bandFilter, batchFilter, dayFilter, teacherFilter, todayOnly, todayRoutineDay]);

  const sessionsByDay = useMemo(() => {
    return routine.days.map((day) => {
      const daySessions = filteredSessions.filter((session) => session.day === day);
      const rows = sortRows(Array.from(new Set(daySessions.map(rowKey))));
      return { day, daySessions, rows };
    }).filter((group) => group.rows.length || (!dayFilter && !todayOnly));
  }, [filteredSessions, dayFilter, todayOnly]);

  return (
    <>
      <TopBar title="Hub Routine" subtitle="Official Spring 2026 CSE routine with filters and teacher highlight." />
      <section className="print-page rounded-2xl bg-[var(--surface)] p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
        <header className="mb-6 text-center">
          <p className="text-sm font-semibold text-[var(--muted)]">{routine.university}</p>
          <h2 className="mt-1 font-[var(--font-poppins)] text-2xl font-bold">{routine.department}</h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <h3 className="font-[var(--font-poppins)] text-3xl font-bold">Class Routine</h3>
            <button onClick={() => window.print()} aria-label="Print routine" className="no-print grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white shadow-sm">
              <Download size={18} />
            </button>
          </div>
          <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Effective from {routine.effectiveDate}</span>
        </header>

        <div className="no-print mb-5 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
          <div className="mb-3 flex items-center gap-2 font-[var(--font-poppins)] font-bold"><Filter size={18} /> Filters</div>
          <div className="grid gap-3 md:grid-cols-5">
            <Select label="Year Band" value={bandFilter} onChange={setBandFilter} options={[["first", "1st Year"], ["second", "2nd Year"], ["third", "3rd Year"], ["fourth", "4th Year"]]} />
            <Select label="Batch/Semester" value={batchFilter} onChange={setBatchFilter} options={batches.map((item) => [item, item])} />
            <Select label="Day" value={dayFilter} onChange={setDayFilter} options={routine.days.map((day) => [day, day])} />
            <Select label="Teacher" value={teacherFilter} onChange={setTeacherFilter} options={teacherEntries.map(([initials, name]) => [initials, `${initials} · ${name}`])} />
            <label className="flex items-end">
              <span className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-bold text-[var(--text)] ring-1 ring-slate-200 dark:bg-slate-950/30 dark:ring-white/10">
                <input type="checkbox" checked={todayOnly} onChange={(event) => setTodayOnly(event.target.checked)} className="h-4 w-4 accent-emerald-500" />
                Today
              </span>
            </label>
          </div>
        </div>

        <div className="hidden overflow-auto rounded-2xl border border-slate-200 dark:border-white/10 lg:block">
          <table className="min-w-[1180px] border-separate border-spacing-0 bg-white text-sm dark:bg-slate-950/10">
            <thead className="sticky top-0 z-20">
              <tr>
                <Header>Day</Header>
                <Header>Year</Header>
                {routine.timeSlots.map((slot, index) => (
                  <Fragment key={slot.id}>
                    {index === 4 && <th key="break" className="w-12 bg-slate-100 text-xs font-bold uppercase text-slate-500 dark:bg-white/10">Break</th>}
                    <Header>{slot.label}</Header>
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessionsByDay.map(({ day, rows, daySessions }) => rows.map((key, rowIndex) => {
                const sessions = daySessions.filter((session) => rowKey(session) === key);
                const semester = key.split("-")[1];
                return (
                  <tr key={`${day}-${key}`}>
                    {rowIndex === 0 && (
                      <td rowSpan={rows.length} className="sticky left-0 z-10 border-b border-slate-100 bg-slate-50 p-3 text-center align-middle dark:border-white/10 dark:bg-slate-900">
                        <span className={`inline-flex rounded-full px-4 py-3 font-[var(--font-poppins)] font-bold text-white ${todayRoutineDay === day ? "ring-4 ring-emerald-300/60" : ""}`} style={{ backgroundColor: "#E04668" }}>{day}</span>
                      </td>
                    )}
                    <td className="sticky left-[82px] z-10 border-b border-slate-100 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
                      <span className="block rounded-xl px-3 py-3 text-center text-xs font-bold text-white" style={{ backgroundColor: bandColors[semester] }}>{rowLabel(key)}</span>
                    </td>
                    {renderSlots(sessions, teacherFilter, setTeacherFilter)}
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 lg:hidden">
          {sessionsByDay.map(({ day, rows, daySessions }) => (
            <details key={day} open className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <summary className="cursor-pointer font-[var(--font-poppins)] text-lg font-bold">{day}</summary>
              <div className="mt-4 space-y-3">
                {rows.map((key) => {
                  const sessions = daySessions.filter((session) => rowKey(session) === key);
                  const semester = key.split("-")[1];
                  return (
                    <div key={key} className="rounded-2xl bg-[var(--surface)] p-4 shadow-sm">
                      <p className="mb-3 inline-flex rounded-xl px-3 py-2 text-sm font-bold text-white" style={{ backgroundColor: bandColors[semester] }}>{rowLabel(key)}</p>
                      <div className="space-y-2">
                        {sessions.map((session) => <SessionLine key={`${key}-${session.slots.join("-")}-${session.course}`} session={session} onTeacher={setTeacherFilter} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>

        <footer className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section>
            <div className="mb-3 flex items-center gap-2 font-[var(--font-poppins)] font-bold"><Users size={19} /> Teacher Legend</div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {teacherEntries.map(([initials, name]) => (
                <button key={initials} onClick={() => setTeacherFilter(initials)} className={`rounded-xl px-3 py-2 text-left text-sm ring-1 ${teacherFilter === initials ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40" : "bg-slate-50 text-[var(--text)] ring-slate-200 dark:bg-white/5 dark:ring-white/10"}`}>
                  <strong>{initials}</strong> <span className="text-[var(--muted)]">→</span> {name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">Unmapped initials: {routine.unmappedInitials.join(", ")}</p>
          </section>
          <section className="self-end text-right">
            <div className="ml-auto mb-3 h-px w-56 bg-slate-300 dark:bg-white/20" />
            <p className="font-[var(--font-poppins)] font-bold">{routine.headOfDepartment.name}</p>
            <p className="text-sm text-[var(--muted)]">{routine.headOfDepartment.designation}</p>
            <p className="text-sm text-[var(--muted)]">Department of CSE, Hamdard University Bangladesh</p>
          </section>
        </footer>
      </section>
    </>
  );
}

function renderSlots(sessions: RoutineSession[], teacherFilter: string, setTeacherFilter: (teacher: string) => void) {
  const cells = [];
  for (let slot = 1; slot <= 6; slot += 1) {
    if (slot === 5) {
      cells.push(<td key="break" className="border-b border-slate-100 bg-slate-100 px-1 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 [writing-mode:vertical-rl] dark:border-white/10 dark:bg-white/10">Break · Prayer</td>);
    }
    const session = sessions.find((item) => item.slots[0] === slot);
    if (!session) {
      const covered = sessions.some((item) => item.slots.includes(slot) && item.slots[0] !== slot);
      if (!covered) cells.push(<td key={slot} className="border-b border-slate-100 p-2 dark:border-white/10"><div className="h-14 rounded-xl bg-slate-100/70 dark:bg-white/5" /></td>);
      continue;
    }
    const color = bandColors[session.semester];
    const dimmed = teacherFilter && teacherFilter !== session.teacher;
    cells.push(
      <td key={slot} colSpan={session.slots.length} className="border-b border-slate-100 p-2 dark:border-white/10">
        <button
          title={`${routine.teachers[session.teacher as keyof typeof routine.teachers] ?? session.teacher} · ${session.course} · Room ${session.room}`}
          onClick={() => setTeacherFilter(session.teacher)}
          className={`h-14 w-full rounded-xl px-2 text-center text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 ${dimmed ? "opacity-25" : "opacity-100"}`}
          style={{ backgroundColor: color }}
        >
          {session.course} · {session.teacher} · R{session.room}
        </button>
      </td>,
    );
    slot += session.slots.length - 1;
  }
  return cells;
}

function SessionLine({ session, onTeacher }: { session: RoutineSession; onTeacher: (teacher: string) => void }) {
  const slotText = session.slots.map((id) => routine.timeSlots.find((slot) => slot.id === id)?.label).join(", ");
  return (
    <button onClick={() => onTeacher(session.teacher)} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-white" style={{ backgroundColor: bandColors[session.semester] }}>
      {slotText} · {session.course} · {session.teacher} · Room {session.room}
    </button>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return <th className="bg-white p-2 dark:bg-slate-900"><span className="block rounded-xl bg-[#E04668] px-3 py-3 text-xs font-bold text-white">{children}</span></th>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="field">
        <option value="">All {label}</option>
        {options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}
      </select>
    </label>
  );
}
