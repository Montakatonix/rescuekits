// src/app/page.tsx
import Link from "next/link";
import PanicSelector from "@/components/PanicSelector";
import KitCard from "@/components/KitCard";
import FAQ from "@/components/FAQ";
import BundleBanner from "@/components/BundleBanner";
import { KITS, BUNDLE, KITS_TOTAL_EUR } from "@/lib/catalog";

const HOME_FAQ = [
  {
    q: "Will this get my account back?",
    a: "Honest answer: no one can promise that — anyone who does is lying to you. The platforms decide. What the kit does is make sure your appeal or response is complete, properly evidenced and free of the mistakes that sink most cases.",
  },
  {
    q: "Is this legal?",
    a: "Yes. Every kit uses the platforms' own official appeal and review processes. Nothing in these kits involves fake documents, new-account workarounds or policy evasion — that route gets you permanently banned.",
  },
  {
    q: "How do I get the files?",
    a: "Instantly. After payment you land on your access page and get an email with your access link. PDF + Word + Excel files, yours to keep.",
  },
  {
    q: "What if it's not a fit?",
    a: "14-day good-faith refund. Email support, you get your money back. (Good-faith means: “I bought the wrong kit” yes, “I used everything and want it free” no.)",
  },
  {
    q: "I'm not in the EU/US — does it apply?",
    a: "The processes covered (Google reinstatement, Meta review, Stripe risk reviews, card network disputes) are global. Currency examples are in EUR but the steps are identical.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pb-20 pt-16 text-white">
        <div className="container-rk">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-teal">
            Recovery playbooks for platform emergencies
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Your platform pulled the plug. Here&apos;s the playbook.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            Step-by-step recovery kits for the four ways platforms freeze a small business: Google
            Business Profile suspensions, Meta ad restrictions, Stripe payout holds, and
            chargebacks. Templates, evidence checklists and exact next steps — written for the
            worst day of your quarter.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-teal">
            No success fees. No &ldquo;recovery agencies&rdquo; taking 25–30% of what&apos;s yours.
            One payment, the playbook is yours forever.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#selector" className="btn-teal">Find my kit ↓</a>
            <Link href="/kits" className="btn-ghost !border-white/30 !text-white hover:!border-teal">
              See all kits
            </Link>
          </div>
        </div>
      </section>

      <PanicSelector />

      {/* How it works */}
      <section className="container-rk mt-16">
        <h2 className="font-display text-2xl font-bold text-navy">How it works</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Get the kit (2 minutes).",
              b: "Pay once, download instantly. PDF guide + templates + trackers.",
            },
            {
              t: "Follow the first-24-hours checklist.",
              b: "Know exactly what to do — and what NOT to do — before you make it worse.",
            },
            {
              t: "Submit your case properly.",
              b: "Use the templates and evidence checklists to file the strongest appeal or response your case allows.",
            },
          ].map((s, i) => (
            <div key={s.t} className="rounded-xl border border-navy/10 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-display font-semibold text-navy">{s.t}</h3>
              <p className="mt-1 text-sm text-ink/70">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kits */}
      <section className="container-rk mt-16">
        <h2 className="font-display text-2xl font-bold text-navy">Four fires. Four playbooks.</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {KITS.map((kit) => (
            <KitCard key={kit.key} kit={kit} />
          ))}
        </div>
      </section>

      {/* Why kits, not agencies */}
      <section className="container-rk mt-16">
        <div className="rounded-xl border border-navy/10 bg-white p-7">
          <h2 className="font-display text-2xl font-bold text-navy">
            The recovery industry has a dirty secret.
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/80">
            &ldquo;Reinstatement services&rdquo; charge €300–€1,500 or take 25–30% of every dispute
            you win — for filling in the same forms you can fill yourself. The hard part isn&apos;t
            access. It&apos;s knowing what the platform wants to see, in what order, and which one
            sentence kills your case. That&apos;s what&apos;s in the kit. €29–€69, once.
          </p>
        </div>
      </section>

      {/* Bundle */}
      <section className="container-rk mt-16">
        <h2 className="sr-only">Bundle</h2>
        <div className="rounded-xl border border-teal/40 bg-navy p-7 text-white">
          <p className="font-display text-xl font-semibold">
            Running ads, taking payments, and on Google Maps? You&apos;re exposed on all four
            fronts.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            The All-in-One Recovery Bundle: all 4 kits for €{BUNDLE.priceEur} instead of €
            {KITS_TOTAL_EUR}. Because you never know which platform flips the switch next.
          </p>
          <Link href="/bundle" className="btn-teal mt-5">
            Get the bundle — save {Math.round((1 - BUNDLE.priceEur / KITS_TOTAL_EUR) * 100)}%
          </Link>
        </div>
      </section>

      <div className="container-rk">
        <FAQ items={HOME_FAQ} />
      </div>
    </>
  );
}
