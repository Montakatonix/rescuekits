// src/app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin, DELIVERABLES_BUCKET } from "@/lib/supabase";
import { kitByKey } from "@/lib/catalog";

export const runtime = "nodejs";

const SIGNED_URL_TTL_SECONDS = 15 * 60; // 15 minutes
const DAILY_DOWNLOAD_LIMIT = 30; // per token, per 24h — generous for humans, hostile to scrapers

const Body = z.object({
  token: z.string().uuid(),
  productKey: z.enum(["chargeback", "gbp", "meta", "stripe-hold"]),
});

function clientMeta(req: NextRequest) {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    user_agent: req.headers.get("user-agent") ?? null,
  };
}

export async function POST(req: NextRequest) {
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const meta = clientMeta(req);

  const deny = async (reason: string, status: number) => {
    await supabaseAdmin.from("events").insert({
      type: "download_denied",
      token: parsed.token,
      product_key: parsed.productKey,
      ...meta,
      payload: { reason },
    });
    return NextResponse.json({ error: reason }, { status });
  };

  // ── token ──
  const { data: token } = await supabaseAdmin
    .from("access_tokens")
    .select("token, order_id, email, expires_at, revoked")
    .eq("token", parsed.token)
    .maybeSingle();

  if (!token) return deny("invalid_token", 403);
  if (token.revoked) return deny("token_revoked", 403);
  if (new Date(token.expires_at) < new Date()) return deny("token_expired", 403);

  // ── entitlement ──
  const { data: entitlement } = await supabaseAdmin
    .from("entitlements")
    .select("id")
    .eq("order_id", token.order_id)
    .eq("product_key", parsed.productKey)
    .maybeSingle();
  if (!entitlement) return deny("not_entitled", 403);

  // ── rate limit (24h window per token) ──
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("type", "download_issued")
    .eq("token", parsed.token)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_DOWNLOAD_LIMIT) return deny("rate_limited", 429);

  // ── signed URL ──
  const kit = kitByKey(parsed.productKey);
  if (!kit) return deny("unknown_product", 400);

  const { data: signed, error: signErr } = await supabaseAdmin.storage
    .from(DELIVERABLES_BUCKET)
    .createSignedUrl(kit.deliverablePath, SIGNED_URL_TTL_SECONDS, {
      download: kit.deliverablePath.split("/").pop(),
    });
  if (signErr || !signed) {
    console.error("signed url error:", signErr);
    return deny("file_unavailable", 500);
  }

  await supabaseAdmin.from("events").insert({
    type: "download_issued",
    order_id: token.order_id,
    token: parsed.token,
    product_key: parsed.productKey,
    ...meta,
    payload: { path: kit.deliverablePath, ttl: SIGNED_URL_TTL_SECONDS },
  });

  return NextResponse.json({ url: signed.signedUrl, expiresIn: SIGNED_URL_TTL_SECONDS });
}
