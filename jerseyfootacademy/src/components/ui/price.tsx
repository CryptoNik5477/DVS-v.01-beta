"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/config/currencies";
import { useCurrency } from "@/lib/currency-store";
import { cn } from "@/lib/utils";

/**
 * Renders a USD-cent price in the user's selected display currency.
 * Falls back to USD during SSR/hydration to avoid mismatches.
 */
export function Price({
  cents,
  className,
  original,
}: {
  cents: number;
  className?: string;
  original?: number; // strike-through original price (e.g. before sale)
}) {
  const currency = useCurrency((s) => s.currency);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const code = mounted ? currency : "USD";

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-semibold">{formatPrice(cents, code)}</span>
      {original && original > cents ? (
        <span className="text-sm font-normal text-navy/40 line-through">
          {formatPrice(original, code)}
        </span>
      ) : null}
    </span>
  );
}
