// src/lib/email.ts — transactional access email via Resend
import { Resend } from "resend";
import { productName, type ProductKey } from "@/lib/catalog";

export async function sendAccessEmail(opts: {
  to: string;
  accessUrl: string;
  productKeys: ProductKey[];
  isBundle: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { ok: false, error: "email env vars missing" };

  const resend = new Resend(apiKey);
  const names = opts.productKeys.map(productName).join(", ");
  const subject = `Your RescueKits access — ${opts.isBundle ? "All-in-One Bundle" : names}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#1c2733;max-width:560px;margin:0 auto;line-height:1.6">
    <p style="letter-spacing:2px;font-size:12px;color:#2f7d5c;font-weight:bold">RESCUEKITS</p>
    <p>Hi,</p>
    <p>Your purchase is confirmed. Here's your access page:</p>
    <p style="margin:24px 0">
      <a href="${opts.accessUrl}"
         style="background:#0e2a3a;color:#ffffff;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold">
        Open my kits →
      </a>
    </p>
    <p style="font-size:13px;color:#5a6a76">Or copy this link: ${opts.accessUrl}</p>
    <p><b>What's on it:</b> ${names} — each as a ZIP with the PDF guide, Word templates and Excel tracker.
    The page is yours for 90 days (renewable free, just reply to this email). Download links regenerate
    every time you click, so don't worry about them expiring.</p>
    <p><b>Start here:</b> open the Main Guide and run the First 24 Hours checklist before anything else.</p>
    <p style="font-size:13px;color:#5a6a76">Receipt: Stripe has emailed it separately.<br>
    Questions or a problem with your case type? Reply to this email — a human reads it.</p>
    <hr style="border:none;border-top:1px solid #e3e8eb;margin:24px 0">
    <p style="font-size:11px;color:#8a98a3">One-time purchase · 14-day good-faith refund ·
    Not affiliated with Google, Meta, Stripe or Shopify.</p>
  </div>`;

  try {
    const { error } = await resend.emails.send({ from, to: opts.to, subject, html });
    if (error) return { ok: false, error: String(error.message ?? error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown email error" };
  }
}
