"use client";

import { CalendarDays, Clock, GraduationCap, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { MyClass } from "@/lib/types";

export function TypeBadge({ type }: { type: MyClass["type"] }) {
  return <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${type === "Theory" ? "bg-[image:var(--theory)]" : "bg-[image:var(--lab)]"}`}>{type}</span>;
}

function Chip({ icon: Icon, children }: { icon: typeof CalendarDays; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white/75 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-950/20 dark:text-slate-200">
      <Icon size={15} className="shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

export function ClassCard({ item, onDelete, compact = false }: { item: MyClass; onDelete: (id: string) => void; compact?: boolean }) {
  const tint = item.type === "Theory" ? "bg-[var(--theory-tint)] dark:bg-emerald-950/40" : "bg-[var(--lab-tint)] dark:bg-amber-950/35";

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] p-4 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
        <TypeBadge type={item.type} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[var(--text)]">{item.courseCode} · {item.courseName}</p>
          <p className="text-sm text-[var(--muted)]">{item.day} · {item.startTime}-{item.endTime} · Room {item.room}</p>
        </div>
        <button aria-label={`Delete ${item.courseCode}`} onClick={() => onDelete(item.id)} className="grid h-9 w-9 place-items-center rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
          <Trash2 size={17} />
        </button>
      </div>
    );
  }

  return (
    <article className={`rounded-2xl p-5 shadow-md ring-1 ring-white/70 ${tint} dark:ring-white/10`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[var(--font-poppins)] text-xl font-bold text-slate-950 dark:text-white">{item.courseCode}</h3>
            <TypeBadge type={item.type} />
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{item.courseName}</p>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="Edit class" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10">
            <Pencil size={16} />
          </button>
          <button aria-label={`Delete ${item.courseCode}`} onClick={() => onDelete(item.id)} className="grid h-9 w-9 place-items-center rounded-xl text-rose-500 hover:bg-white/70 dark:hover:bg-white/10">
            <Trash2 size={16} />
          </button>
          <MoreVertical size={16} className="text-slate-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Chip icon={CalendarDays}>{item.day}</Chip>
        <Chip icon={Clock}>{item.startTime}-{item.endTime}</Chip>
        <Chip icon={MapPin}>Room {item.room}</Chip>
        <Chip icon={GraduationCap}>{item.semester.replace("ester", "")} ({item.program})</Chip>
      </div>
    </article>
  );
}
