// src/lib/stripe.ts — server-only Stripe client
import Stripe from "stripe";

let client: Stripe | null = null;

function createStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");

  // During pre-launch we intentionally deploy production URLs with Stripe TEST keys
  // for end-to-end checkout testing. Switch to live keys before public launch.
  return new Stripe(key);
}

export function getStripe(): Stripe {
  if (!client) client = createStripeClient();
  return client;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe() as unknown as object, prop, receiver);
  },
});
