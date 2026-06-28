"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customization } from "@/config/customization";
import { customizationSurcharge } from "@/config/customization";

export interface CartItem {
  // Unique line id (product+size+color+customization signature)
  lineId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  unitPrice: number; // base unit price in USD cents (excl. customization)
  quantity: number;
  customization?: Customization;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineId" | "quantity">, qty?: number) => void;
  removeItem: (lineId: string) => void;
  updateQty: (lineId: string, qty: number) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

function lineSignature(i: Omit<CartItem, "lineId" | "quantity">): string {
  const c = i.customization;
  const custom = c ? `${c.name ?? ""}|${c.number ?? ""}|${c.font}|${c.color}` : "";
  return `${i.slug}::${i.size}::${i.color}::${custom}`;
}

/** Per-line total including any customization surcharge. */
export function lineTotal(item: CartItem): number {
  const surcharge = customizationSurcharge(item.customization);
  return (item.unitPrice + surcharge) * item.quantity;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        const lineId = lineSignature(item);
        set((state) => {
          const existing = state.items.find((i) => i.lineId === lineId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === lineId ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, lineId, quantity: qty }] };
        });
      },
      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),
      updateQty: (lineId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.lineId === lineId ? { ...i, quantity: Math.max(1, qty) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + lineTotal(i), 0),
    }),
    { name: "jfa-cart" },
  ),
);
