import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] p-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">{label}</p>
          <p className="mt-2 font-[var(--font-poppins)] text-4xl font-bold text-[var(--text)]">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${tone}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
