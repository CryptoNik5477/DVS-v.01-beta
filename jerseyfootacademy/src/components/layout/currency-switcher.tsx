"use client";

import { useCurrency } from "@/lib/currency-store";
import { currencies, currencyCodes } from "@/config/currencies";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className="inline-flex items-center text-xs">
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as typeof currency)}
        className="cursor-pointer rounded-full bg-transparent px-2 py-1 font-semibold outline-none hover:bg-white/10"
      >
        {currencyCodes.map((c) => (
          <option key={c} value={c} className="text-navy">
            {currencies[c].symbol} {c}
          </option>
        ))}
      </select>
    </label>
  );
}
