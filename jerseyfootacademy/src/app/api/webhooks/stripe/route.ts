import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * Stripe webhook — marks orders as PAID when checkout completes.
 * Configure the endpoint URL + signing secret (STRIPE_WEBHOOK_SECRET).
 * The raw body is required for signature verification, so this route reads text().
 */
export async function POST(req: Request) {
  if (!isStripeConfigured || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhooks not configured." }, { status: 503 });
  }

  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      payment_intent?: string;
      customer_details?: { email?: string };
    };
    try {
      const order = await prisma.order.update({
        where: { stripeSessionId: session.id },
        data: {
          status: "PAID",
          stripePaymentIntentId: session.payment_intent ?? null,
          email: session.customer_details?.email ?? undefined,
        },
      });
      // Count the redemption against the promo code's usage limit.
      if (order.promoCodeId) {
        await prisma.promoCode.update({
          where: { id: order.promoCodeId },
          data: { usageCount: { increment: 1 } },
        });
      }
    } catch {
      // Order row may not exist (DB-less mode) — acknowledge anyway.
    }
  }

  return NextResponse.json({ received: true });
}
