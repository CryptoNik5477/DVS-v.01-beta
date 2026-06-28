import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { formatPrice } from "@/config/currencies";
import { siteConfig } from "@/config/site";

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
      // Order confirmation email (best-effort; no-ops without RESEND_API_KEY).
      if (order.email && order.email.includes("@")) {
        await sendEmail({
          to: order.email,
          replyTo: siteConfig.contact.email,
          subject: `Order ${order.number} confirmed — ${siteConfig.name}`,
          html: emailLayout(
            "Thank you for your order! 🎉",
            `<p style="font-size:15px;line-height:1.6;color:#3b4252">
               We've received your payment and your order <strong>${order.number}</strong> is being prepared.
             </p>
             <p style="font-size:15px;color:#0b132b"><strong>Total paid: ${formatPrice(order.total, "USD")}</strong></p>
             <p style="margin:24px 0">
               <a href="${siteConfig.url}/account" style="background:#c8102e;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">
                 Track your order
               </a>
             </p>
             <p style="font-size:13px;color:#8a93a6">Ships from ${siteConfig.shipsFrom}. You'll get tracking once it's on the way.</p>`,
          ),
        });
      }
    } catch {
      // Order row may not exist (DB-less mode) — acknowledge anyway.
    }
  }

  return NextResponse.json({ received: true });
}
