"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

async function requireAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

const schema = z.object({
  id: z.string().optional(),
  code: z.string().min(2).max(40).regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, - and _ only."),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().min(0).max(100000),
  minOrder: z.coerce.number().min(0).max(100000).optional(),
  usageLimit: z.coerce.number().int().min(0).max(1_000_000).optional(),
  active: z.coerce.boolean().optional(),
  expiresAt: z.string().optional(),
});

/** Create or update a promo code. PERCENT value is 0-100; FIXED value is USD. */
export async function upsertPromo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid promo." };
  const d = parsed.data;

  if (d.type === "PERCENT" && d.value > 100) return { error: "Percent must be 0–100." };

  const data = {
    code: d.code.toUpperCase(),
    type: d.type,
    value: d.type === "FIXED" ? Math.round(d.value * 100) : Math.round(d.value),
    minOrder: d.minOrder ? Math.round(d.minOrder * 100) : null,
    usageLimit: d.usageLimit && d.usageLimit > 0 ? d.usageLimit : null,
    active: d.active ?? false,
    expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
  };

  try {
    if (d.id) {
      await prisma.promoCode.update({ where: { id: d.id }, data });
    } else {
      await prisma.promoCode.create({ data });
    }
    revalidatePath("/admin/promos");
    return { ok: true, message: d.id ? "Promo updated." : "Promo created." };
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "That code already exists." : "Database error — is the DB configured?";
    return { error: msg };
  }
}

export async function deletePromoAction(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };
  try {
    await prisma.promoCode.delete({ where: { id } });
    revalidatePath("/admin/promos");
    return { ok: true };
  } catch {
    return { error: "Could not delete promo." };
  }
}
