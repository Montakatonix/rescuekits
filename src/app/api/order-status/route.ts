// src/app/api/order-status/route.ts
// Polled by /thank-you while the webhook finishes (race-condition bridge).
// Validates the session against Stripe before revealing anything.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ status: "unpaid" });
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, email")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (!order) return NextResponse.json({ status: "processing" });

    const { data: token } = await supabaseAdmin
      .from("access_tokens")
      .select("token")
      .eq("order_id", order.id)
      .eq("revoked", false)
      .maybeSingle();
    if (!token) return NextResponse.json({ status: "processing" });

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_key")
      .eq("order_id", order.id);

    return NextResponse.json({
      status: "ready",
      token: token.token,
      email: order.email,
      purchasedKeys: (items ?? []).map((i) => i.product_key),
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (e) {
    console.error("order-status error:", e);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
