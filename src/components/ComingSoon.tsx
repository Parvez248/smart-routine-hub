import { Construction } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <TopBar title={title} subtitle="This module is reserved for Phase 2." />
      <section className="grid min-h-[60vh] place-items-center rounded-2xl bg-[var(--surface)] p-8 text-center shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-600">
            <Construction size={30} />
          </div>
          <h2 className="mt-5 font-[var(--font-poppins)] text-3xl font-bold">{title} Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">The navigation and protected shell are ready; the full workflow can be layered in during the backend phase.</p>
        </div>
      </section>
    </>
  );
}
