/**
 * Demo promo codes for instant testing without a database.
 * In production these live in the `PromoCode` table (managed from the admin
 * dashboard); `validatePromo` here is the offline fallback.
 */
export interface PromoResult {
  ok: boolean;
  code?: string;
  discount?: number; // USD cents to subtract
  message: string;
}

const DEMO_PROMOS: Record<string, { type: "PERCENT" | "FIXED"; value: number; minOrder?: number }> = {
  WELCOME10: { type: "PERCENT", value: 10 },
  WORLDCUP26: { type: "PERCENT", value: 15, minOrder: 10000 },
  GOAL20: { type: "FIXED", value: 2000, minOrder: 12000 },
};

export function validatePromo(rawCode: string, subtotal: number): PromoResult {
  const code = rawCode.trim().toUpperCase();
  const promo = DEMO_PROMOS[code];
  if (!promo) return { ok: false, message: "Invalid promo code." };
  if (promo.minOrder && subtotal < promo.minOrder) {
    return { ok: false, message: `Requires a minimum order.` };
  }
  const discount =
    promo.type === "PERCENT" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return { ok: true, code, discount, message: `Code ${code} applied!` };
}
