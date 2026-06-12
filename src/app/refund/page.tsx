// src/app/refund/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <div className="container-rk max-w-3xl pt-12">
      <h1 className="font-display text-3xl font-bold text-navy">Refund Policy</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink/80">
        <section>
          <h2 className="font-display text-xl font-bold text-navy">The 14-day good-faith refund</h2>
          <p className="mt-2">
            Bought the wrong kit, the content doesn&apos;t match the description, or it&apos;s
            genuinely not a fit? Email us within 14 days of purchase and you get a full refund — no
            interrogation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">What good faith means</h2>
          <p className="mt-2">
            &ldquo;I bought the wrong kit&rdquo; — yes. &ldquo;I downloaded everything, used the
            templates, and would now like it free&rdquo; — no. We log deliveries and downloads, and
            we reserve the right to decline refunds that are clearly attempts to keep the content
            without paying for it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">Your statutory withdrawal right</h2>
          <p className="mt-2">
            At checkout you expressly consented to immediate delivery of digital content and
            acknowledged that you thereby waive the 14-day statutory right of withdrawal for
            digital content (EU Directive 2011/83/EU). Our voluntary policy above replaces it and
            matches its 14-day window.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-navy">How to request</h2>
          <p className="mt-2">
            Email <b>support@rescuekits.store</b> from your purchase email (or include your Stripe
            receipt). Refunds are processed within 2 business days; your bank may take a few more
            days to show it.
          </p>
        </section>
      </div>
    </div>
  );
}
