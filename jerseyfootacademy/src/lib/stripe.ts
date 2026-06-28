import Stripe from "stripe";

/**
 * Server-side Stripe client. The architecture keeps payment logic isolated here
 * and in the API routes so additional payment providers (PayPal, PromptPay,
 * crypto, …) can be added behind the same checkout abstraction later.
 */
const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2024-12-18.acacia", typescript: true })
  : // Lazy guard: throw only if used without a key, so the app still builds/runs
    // (browsing, etc.) when Stripe isn't configured yet.
    (new Proxy(
      {},
      {
        get() {
          throw new Error("STRIPE_SECRET_KEY is not set — configure it in .env to enable checkout.");
        },
      },
    ) as unknown as Stripe);

export const isStripeConfigured = Boolean(key);
