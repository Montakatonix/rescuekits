// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { stripePriceId, kitByKey, PREVENTION } from "@/lib/catalog";

export const runtime = "nodejs";

const Body = z.object({
  productKey: z.enum(["chargeback", "gbp", "meta", "stripe-hold", "bundle"]),
  withPrevention: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Reject inactive kits defensively (catalog drives everything)
  if (parsed.productKey !== "bundle" && !kitByKey(parsed.productKey)?.active) {
    return NextResponse.json({ error: "Product unavailable" }, { status: 400 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const lineItems: { price: string; quantity: number }[] = [
    { price: stripePriceId(parsed.productKey), quantity: 1 },
  ];
  if (parsed.withPrevention && PREVENTION.active) {
    lineItems.push({ price: stripePriceId("prevention"), quantity: 1 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      // EU digital-content withdrawal waiver: explicit consent at checkout.
      consent_collection: { terms_of_service: "required" },
      custom_text: {
        terms_of_service_acceptance: {
          message:
            "I agree to the [Terms](" +
            site +
            "/terms) and to immediate delivery of this digital content, and I acknowledge that I thereby waive my 14-day statutory right of withdrawal (EU Directive 2011/83/EU). RescueKits' own 14-day good-faith [refund policy](" +
            site +
            "/refund) still applies.",
        },
      },
      metadata: { product_key: parsed.productKey, with_prevention: String(parsed.withPrevention) },
      success_url: `${site}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/kits`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout error:", e);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
