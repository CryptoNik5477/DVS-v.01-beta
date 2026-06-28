import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-navy/50">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          {i === items.length - 1 ? (
            <span className="font-semibold text-navy">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-red">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
