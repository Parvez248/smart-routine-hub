import { CalendarDays } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[image:var(--brand-gradient)] text-white shadow-lg shadow-emerald-500/20">
        <CalendarDays size={23} />
      </div>
      {!compact && (
        <div>
          <p className="font-[var(--font-poppins)] text-lg font-bold leading-5 text-[var(--text)]">Smart Routine Hub</p>
          <p className="text-xs font-medium text-[var(--muted)]">Hamdard University Bangladesh</p>
        </div>
      )}
    </div>
  );
}
