import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { productBySlug, effectivePrice } from "@/data/products";
import { customizationSurcharge } from "@/config/customization";
import { quoteShipping, type ShippingMethodId } from "@/config/shipping";
import { validatePromo } from "@/config/promos";
import { siteConfig } from "@/config/site";
import { generateOrderNumber } from "@/lib/utils";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string(),
        size: z.string(),
        color: z.string(),
        quantity: z.number().int().min(1).max(20),
        customization: z
          .object({
            name: z.string().optional(),
            number: z.string().optional(),
            font: z.string(),
            color: z.string(),
          })
          .optional(),
      }),
    )
    .min(1),
  country: z.string().length(2),
  method: z.enum(["STANDARD", "EXPRESS"]),
  promoCode: z.string().optional(),
});

export async function POST(req: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { items, country, method, promoCode } = parsed.data;

  // SECURITY: recompute every price server-side from canonical data.
  // Never trust client-supplied prices.
  const lineItems = items.map((item) => {
    const product = productBySlug.get(item.slug);
    if (!product) throw new Error(`Unknown product: ${item.slug}`);
    const surcharge = item.customization ? customizationSurcharge(item.customization) : 0;
    const unitAmount = effectivePrice(product) + surcharge;
    const custom = item.customization?.name || item.customization?.number
      ? ` (${item.customization?.name ?? ""} ${item.customization?.number ?? ""})`.trimEnd()
      : "";
    return {
      product,
      quantity: item.quantity,
      unitAmount,
      stripe: {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: `${product.name} — ${item.size}${custom}`,
            images: product.images.slice(0, 1),
          },
        },
      },
    };
  });

  const subtotal = lineItems.reduce((s, li) => s + li.unitAmount * li.quantity, 0);
  const itemCount = lineItems.reduce((n, li) => n + li.quantity, 0);
  const shipping = quoteShipping(country, itemCount, subtotal, method as ShippingMethodId);

  // Discount (optional) → Stripe coupon created on the fly.
  let discountAmount = 0;
  const discounts: { coupon: string }[] = [];
  if (promoCode) {
    const promo = validatePromo(promoCode, subtotal);
    if (promo.ok && promo.discount) {
      discountAmount = promo.discount;
      const coupon = await stripe.coupons.create({
        amount_off: promo.discount,
        currency: "usd",
        name: promo.code,
        duration: "once",
      });
      discounts.push({ coupon: coupon.id });
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems.map((li) => li.stripe),
    discounts: discounts.length ? discounts : undefined,
    shipping_options: shipping.free
      ? undefined
      : [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shipping.cost, currency: "usd" },
              display_name: `${shipping.zoneLabel} ${method === "EXPRESS" ? "Express" : "Standard"}`,
              delivery_estimate: {
                minimum: { unit: "business_day", value: shipping.etaDays[0] },
                maximum: { unit: "business_day", value: shipping.etaDays[1] },
              },
            },
          },
        ],
    // Apple Pay & Google Pay appear automatically alongside cards in Checkout.
    payment_method_types: ["card"],
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: [country.toUpperCase() as never] },
    success_url: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.url}/cart`,
    metadata: { country, method, promoCode: promoCode ?? "", discountAmount: String(discountAmount) },
  });

  // Best-effort: persist a PENDING order. Skipped silently if DB is unavailable.
  try {
    await prisma.order.create({
      data: {
        number: generateOrderNumber(),
        email: session.customer_details?.email ?? "pending@checkout",
        currency: "USD",
        subtotal,
        shippingCost: shipping.cost,
        discountAmount,
        total: subtotal - discountAmount + shipping.cost,
        shippingZone: shipping.zone,
        shippingMethod: method,
        stripeSessionId: session.id,
        items: {
          create: lineItems.map((li) => ({
            productId: undefined,
            name: li.product.name,
            size: items.find((i) => i.slug === li.product.slug)?.size ?? "M",
            color: "Home",
            unitPrice: li.unitAmount,
            quantity: li.quantity,
          })),
        },
      },
    });
  } catch {
    // No database configured yet — Stripe checkout still proceeds.
  }

  return NextResponse.json({ url: session.url });
}
