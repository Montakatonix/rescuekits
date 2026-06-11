import Link from "next/link";
import { KITS } from "@/lib/catalog";

// The signature element: four oversized "emergency panel" switches.
export default function PanicSelector() {
  return (
    <section id="selector" className="container-rk -mt-10 pb-4">
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-xl shadow-navy/10 sm:p-8">
        <h2 className="font-display text-xl font-bold text-navy">What just happened to you?</h2>
        <p className="mt-1 text-sm text-ink/70">Pick your fire. 30 seconds to the exact playbook.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {KITS.map((kit) => (
            <Link
              key={kit.key}
              href={`/kits/${kit.slug}`}
              className="group flex items-start gap-4 rounded-lg border-2 border-navy/15 bg-paper p-4
                         transition hover:-translate-y-0.5 hover:border-teal-dark hover:bg-white
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <span aria-hidden className="mt-0.5 text-2xl">{kit.emoji}</span>
              <span>
                <span className="block font-display font-semibold text-navy group-hover:text-teal-dark">
                  {kit.cardTagline}
                </span>
                <span className="mt-0.5 block text-xs text-ink/60">
                  {kit.key === "gbp" && "Customers can't find me anymore"}
                  {kit.key === "meta" && "My ads stopped overnight"}
                  {kit.key === "stripe-hold" && "My money is frozen"}
                  {kit.key === "chargeback" && "I have days to respond"}
                </span>
              </span>
              <span aria-hidden className="ml-auto self-center font-display text-navy/30 transition group-hover:translate-x-1 group-hover:text-teal-dark">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
