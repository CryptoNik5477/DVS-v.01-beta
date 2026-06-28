import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  cta,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-navy/60">{subtitle}</p>}
      </div>
      {href && cta && (
        <Link
          href={href}
          className="flex flex-none items-center gap-1 text-sm font-semibold text-red hover:gap-2 transition-all"
        >
          {cta} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
