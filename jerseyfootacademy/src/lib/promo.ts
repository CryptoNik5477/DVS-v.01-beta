import { prisma } from "@/lib/prisma";
import { validatePromo as validateDemoPromo, type PromoResult } from "@/config/promos";

export interface ServerPromoResult extends PromoResult {
  promoId?: string; // set when the code comes from the database
}

/**
 * Validate a promo code against the database first (active, not expired, within
 * usage limit, meets minimum order). Falls back to the offline demo codes in
 * src/config/promos.ts when the DB is unavailable or the code isn't found there.
 */
export async function validatePromoServer(
  rawCode: string,
  subtotal: number,
): Promise<ServerPromoResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a promo code." };

  try {
    const promo = await prisma.promoCode.findUnique({ where: { code } });
    if (promo) {
      if (!promo.active) return { ok: false, message: "This code is no longer active." };
      if (promo.expiresAt && promo.expiresAt.getTime() < Date.now()) {
        return { ok: false, message: "This code has expired." };
      }
      if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) {
        return { ok: false, message: "This code has reached its usage limit." };
      }
      if (promo.minOrder != null && subtotal < promo.minOrder) {
        return { ok: false, message: "Order total is below the minimum for this code." };
      }
      const discount =
        promo.type === "PERCENT"
          ? Math.round((subtotal * promo.value) / 100)
          : Math.min(promo.value, subtotal);
      return { ok: true, code, discount, message: `Code ${code} applied!`, promoId: promo.id };
    }
    // Not in DB → try demo codes (useful in dev / before seeding).
    return validateDemoPromo(code, subtotal);
  } catch {
    // DB unavailable → demo codes only.
    return validateDemoPromo(code, subtotal);
  }
}
