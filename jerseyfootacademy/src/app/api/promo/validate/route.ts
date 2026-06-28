import { NextResponse } from "next/server";
import { z } from "zod";
import { validatePromoServer } from "@/lib/promo";

const schema = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().int().min(0),
});

/** Validate a promo code (DB-aware, with demo fallback). Used by the cart. */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  const { code, subtotal } = parsed.data;
  const result = await validatePromoServer(code, subtotal);
  // Never expose the internal promo id to the client.
  return NextResponse.json({ ok: result.ok, code: result.code, discount: result.discount, message: result.message });
}
