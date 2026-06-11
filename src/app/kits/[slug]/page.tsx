// src/app/kits/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuyButton from "@/components/BuyButton";
import BundleBanner from "@/components/BundleBanner";
import FAQ from "@/components/FAQ";
import { KITS, kitBySlug } from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return KITS.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kit = kitBySlug(slug);
  if (!kit) return {};
  return { title: kit.name, description: kit.subhead };
}

export default async function KitPage({ params }: Props) {
  const { slug } = await params;
  const kit = kitBySlug(slug);
  if (!kit || !kit.active) notFound();

  return (
    <>
      {/* Kit hero */}
      <section className="bg-navy py-14 text-white">
        <div className="container-rk">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-teal">
            {kit.emoji} {kit.name} · €{kit.priceEur}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            {kit.headline}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/80">{kit.subhead}</p>
          <div className="mt-7 max-w-xl">
            <BuyButton
              productKey={kit.key as "chargeback" | "gbp" | "meta" | "stripe-hold"}
              label={`Get the ${kit.shortName} Kit — €${kit.priceEur}`}
              priceEur={kit.priceEur}
              showPreventionBump
              variant="teal"
            />
          </div>
        </div>
      </section>

      <div className="container-rk mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Included */}
          <h2 className="font-display text-2xl font-bold text-navy">What&apos;s included</h2>
          <ul className="mt-4 space-y-3">
            {kit.included.map((item) => (
              <li key={item} className="flex gap-3 rounded-lg border border-navy/10 bg-white p-4 text-sm leading-relaxed">
                <span aria-hidden className="font-bold text-teal-dark">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Not included */}
          <h2 className="mt-10 font-display text-2xl font-bold text-navy">
            What&apos;s NOT included
          </h2>
          <ul className="mt-4 space-y-2">
            {kit.notIncluded.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                <span aria-hidden className="font-bold text-danger">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Who for */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-teal-dark/30 bg-teal/10 p-5">
              <h3 className="font-display font-semibold text-navy">Who it&apos;s for</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{kit.whoFor}</p>
            </div>
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-5">
              <h3 className="font-display font-semibold text-navy">Not for you if</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{kit.notFor}</p>
            </div>
          </div>

          {/* Guarantee */}
          <div className="mt-10 rounded-lg border border-gold/50 bg-gold/10 p-5">
            <h3 className="font-display font-semibold text-navy">Guarantee</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              14-day refund if the kit isn&apos;t a fit. Due to the nature of digital downloads,
              refunds are granted in good faith.
            </p>
          </div>

          <FAQ items={kit.faq} />
        </div>

        {/* Sticky buy column */}
        <aside className="lg:pt-2">
          <div className="rounded-xl border border-navy/10 bg-white p-6 lg:sticky lg:top-20">
            <p className="font-display text-3xl font-bold text-navy">€{kit.priceEur}</p>
            <p className="mt-1 text-sm text-ink/60">One-time payment. Yours forever.</p>
            <div className="mt-5">
              <BuyButton
                productKey={kit.key as "chargeback" | "gbp" | "meta" | "stripe-hold"}
                label={`Get the kit — €${kit.priceEur}`}
                priceEur={kit.priceEur}
                showPreventionBump
              />
            </div>
          </div>
          <div className="mt-5">
            <BundleBanner currentPriceEur={kit.priceEur} />
          </div>
        </aside>
      </div>
    </>
  );
}
