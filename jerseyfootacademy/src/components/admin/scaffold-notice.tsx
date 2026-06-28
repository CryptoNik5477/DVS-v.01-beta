import { Wrench } from "lucide-react";

/** Shared placeholder for admin sections that are scaffolded but not yet wired. */
export function ScaffoldNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <div className="mt-6 flex items-start gap-3 rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
        <Wrench className="mt-0.5 flex-none text-gold" size={20} />
        <div className="text-sm text-navy/70">{children}</div>
      </div>
    </div>
  );
}
