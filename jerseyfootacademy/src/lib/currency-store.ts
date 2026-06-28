"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultCurrency, type CurrencyCode } from "@/config/currencies";

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: defaultCurrency,
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "jfa-currency" },
  ),
);
