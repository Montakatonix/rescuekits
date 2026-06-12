// src/app/api/webhook/route.ts
// Single source of truth for order creation. /thank-you only READS.
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendAccessEmail } from "@/lib/email";
import { BUNDLE_CONTENTS, productKeyForPriceId, type ProductKey } from "@/lib/catalog";

export const runtime = "nodejs";

const VALID_KEYS: ProductKey[] = ["chargeback", "gbp", "meta", "stripe-hold", "bundle", "prevention"];

async function log(type: string, fields: Record<string, unknown> = {}) {
  await supabaseAdmin.from("events").insert({ type, ...fields });
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("webhook signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Idempotency: stripe_events.id is the PK; a duplicate insert conflicts ──
  const { error: dedupErr } = await supabaseAdmin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type, payload: event as unknown as Record<string, unknown> });
  if (dedupErr) {
    // 23505 = unique violation → we've already processed this event
    if (dedupErr.code === "23505") {
      await log("webhook_duplicate", { payload: { event_id: event.id, type: event.type } });
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("stripe_events insert failed:", dedupErr);
    return NextResponse.json({ error: "Storage error" }, { status: 500 }); // Stripe will retry
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "charge.refunded":
        await markOrder(event.data.object.payment_intent, "refunded", "order_refunded");
        break;
      case "charge.dispute.created":
        await markOrder(event.data.object.payment_intent, "disputed", "order_disputed");
        break;
      default:
        break; // ignore everything else
    }
  } catch (e) {
    console.error(`handler error for ${event.type}:`, e);
    // Remove the dedup row so Stripe's retry can re-process this event.
    await supabaseAdmin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) throw new Error(`session ${session.id} has no email`);

  // ── order (unique on stripe_session_id as a second idempotency net) ──
  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      email,
      amount_total_cents: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
      status: "paid",
      country: session.customer_details?.address?.country ?? null,
    })
    .select("id")
    .single();

  if (orderErr) {
    if (orderErr.code === "23505") return; // order already exists → nothing to do
    throw orderErr;
  }
  const orderId = order.id as string;

  // ── line items → order_items + purchased keys (resolved by price id) ──
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 });

  const purchasedKeys: ProductKey[] = [];
  for (const item of lineItems.data) {
    const priceId = item.price?.id;
    const key =
      (priceId ? productKeyForPriceId(priceId) : undefined) ??
      (session.metadata?.product_key as ProductKey | undefined);
    if (!key || !VALID_KEYS.includes(key)) continue;
    purchasedKeys.push(key);
    await supabaseAdmin.from("order_items").insert({
      order_id: orderId,
      product_key: key,
      price_cents: item.amount_total ?? null,
    });
  }
  if (purchasedKeys.length === 0 && session.metadata?.product_key) {
    purchasedKeys.push(session.metadata.product_key as ProductKey);
  }

  // ── entitlements: bundle expands into its contents ──
  const entitled = new Set<ProductKey>();
  for (const key of purchasedKeys) {
    if (key === "bundle") BUNDLE_CONTENTS.forEach((k) => entitled.add(k));
    else entitled.add(key);
  }
  for (const key of entitled) {
    const { error } = await supabaseAdmin
      .from("entitlements")
      .insert({ order_id: orderId, email, product_key: key });
    if (error && error.code !== "23505") throw error;
  }

  // ── access token (90 days) ──
  const { data: tokenRow, error: tokenErr } = await supabaseAdmin
    .from("access_tokens")
    .insert({ order_id: orderId, email })
    .select("token")
    .single();
  if (tokenErr) throw tokenErr;

  await log("order_created", {
    order_id: orderId,
    payload: { session_id: session.id, keys: [...entitled], amount: session.amount_total },
  });

  // ── access email (failure logged, never blocks the order) ──
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const accessUrl = `${site}/access?token=${tokenRow.token}`;
  const emailRes = await sendAccessEmail({
    to: email,
    accessUrl,
    productKeys: [...entitled],
    isBundle: purchasedKeys.includes("bundle"),
  });
  await log(emailRes.ok ? "email_sent" : "email_failed", {
    order_id: orderId,
    payload: emailRes.ok ? { to: email } : { to: email, error: emailRes.error },
  });
}

async function markOrder(
  paymentIntent: string | Stripe.PaymentIntent | null,
  status: "refunded" | "disputed",
  eventType: string,
) {
  const piId = typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;
  if (!piId) return;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("stripe_payment_intent_id", piId)
    .select("id")
    .maybeSingle();
  if (!order) return;

  // Revoke access on refund/dispute; the events table already holds the
  // delivery evidence (downloads with IP/UA/timestamps) for representment.
  await supabaseAdmin.from("access_tokens").update({ revoked: true }).eq("order_id", order.id);
  await log(eventType, { order_id: order.id, payload: { payment_intent: piId } });
}
