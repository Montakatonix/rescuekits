import Link from "next/link";
import type { Kit } from "@/lib/catalog";

export default function KitCard({ kit }: { kit: Kit }) {
  return (
    <article className="flex flex-col rounded-xl border border-navy/10 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span aria-hidden className="text-2xl">{kit.emoji}</span>
        <span className="font-display text-lg font-bold text-navy">€{kit.priceEur}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-navy">{kit.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{kit.cardBody}</p>
      <Link href={`/kits/${kit.slug}`} className="btn-primary mt-5 self-start !px-5 !py-2.5 text-sm">
        Get the kit →
      </Link>
    </article>
  );
}
