// src/lib/stripe.ts — server-only Stripe client
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error("STRIPE_SECRET_KEY is not set");

// Guard against test/live key mix-ups in production deployments.
if (process.env.VERCEL_ENV === "production" && key.startsWith("sk_test_")) {
  throw new Error("Production deployment is using a Stripe TEST key");
}

export const stripe = new Stripe(key);
