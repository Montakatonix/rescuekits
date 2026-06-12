// src/app/bundle/page.tsx
import type { Metadata } from "next";
import BuyButton from "@/components/BuyButton";
import FAQ from "@/components/FAQ";
import { BUNDLE, KITS, KITS_TOTAL_EUR } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All-in-One Recovery Bundle",
  description: BUNDLE.subhead,
};

const BUNDLE_FAQ = [
  {
    q: "I only have ONE problem right now.",
    a: "Then buy that kit — seriously. The bundle is for merchants who depend on all four platforms and want the shelf stocked. (And if you buy a single kit today, the upgrade to the bundle for the difference is one click on your access page.)",
  },
  {
    q: "Do I get updates?",
    a: "Yes — v1.x updates to all four kits are included, delivered to the same access page.",
  },
  {
    q: "Is the Prevention Pack in the bundle?",
    a: "No — it's a separate €29 add-on at checkout, here and on every kit page.",
  },
];

export default function BundlePage() {
  const discount = Math.round((1 - BUNDLE.priceEur / KITS_TOTAL_EUR) * 100);
  return (
    <>
      <section className="bg-navy py-14 text-white">
        <div className="container-rk">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-teal">
            All-in-One Recovery Bundle
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            {BUNDLE.headline}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/80">{BUNDLE.subhead}</p>
        </div>
      </section>

      <div className="container-rk mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {/* The math */}
          <h2 className="font-display text-2xl font-bold text-navy">The math</h2>
          <div className="mt-4 rounded-xl border border-navy/10 bg-white p-6">
            <ul className="space-y-2 text-sm">
              {KITS.map((kit) => (
                <li key={kit.key} className="flex justify-between border-b border-navy/5 pb-2">
                  <span>
                    {kit.emoji} {kit.name}
                  </span>
                  <span className="font-display font-semibold">€{kit.priceEur}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-display text-lg text-navy">
              Separately: <s className="text-ink/50">€{KITS_TOTAL_EUR}</s>. Bundle:{" "}
              <b>€{BUNDLE.priceEur}</b>{" "}
              <span className="ml-1 rounded bg-teal/20 px-2 py-0.5 text-sm font-semibold text-teal-dark">
                save {discount}%
              </span>
            </p>
            <p className="mt-1 text-sm font-semibold text-teal-dark">
              Launch price: €{BUNDLE.launchPriceEur} for the first two weeks.
            </p>
          </div>

          <p className="mt-8 max-w-3xl leading-relaxed text-ink/80">
            Nobody buys a fire extinguisher during the fire — they overpay for the fire brigade
            instead. That&apos;s the entire &ldquo;recovery agency&rdquo; business model:
            €300–€1,500 per incident, or 25–30% of every dispute, forever. €{BUNDLE.priceEur} once
            ends that.
          </p>

          <div className="mt-8 rounded-lg border border-navy/10 bg-white p-5 text-sm leading-relaxed">
            <h3 className="font-display font-semibold text-navy">Includes</h3>
            <p className="mt-2 text-ink/80">
              All 4 complete kits — every guide, all 20+ templates, every tracker — plus all future
              v1.x updates to these four kits.
            </p>
          </div>

          <div className="mt-5 rounded-lg border border-gold/50 bg-gold/10 p-5 text-sm">
            <h3 className="font-display font-semibold text-navy">Guarantee</h3>
            <p className="mt-2 text-ink/80">
              Same 14-day good-faith refund, on the whole bundle.
            </p>
          </div>

          <FAQ items={BUNDLE_FAQ} />
        </div>

        <aside className="lg:pt-2">
          <div className="rounded-xl border border-navy/10 bg-white p-6 lg:sticky lg:top-20">
            <p className="font-display text-3xl font-bold text-navy">
              €{BUNDLE.priceEur}
              <span className="ml-2 align-middle text-base font-medium text-ink/50">
                <s>€{KITS_TOTAL_EUR}</s>
              </span>
            </p>
            <p className="mt-1 text-sm text-ink/60">All 4 kits. One payment. Yours forever.</p>
            <div className="mt-5">
              <BuyButton
                productKey="bundle"
                label={`Get all 4 kits — €${BUNDLE.priceEur}`}
                priceEur={BUNDLE.priceEur}
                showPreventionBump
                variant="teal"
              />
            </div>
            <p className="mt-3 text-xs text-ink/60">
              Have a launch promo code? Enter it on the Stripe checkout page.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
