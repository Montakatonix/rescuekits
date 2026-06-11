import type { FaqItem } from "@/lib/catalog";

export default function FAQ({ items, title = "FAQ" }: { items: FaqItem[]; title?: string }) {
  return (
    <section id="faq" className="mt-12">
      <h2 className="font-display text-2xl font-bold text-navy">{title}</h2>
      <div className="mt-4 divide-y divide-navy/10 rounded-xl border border-navy/10 bg-white">
        {items.map((item) => (
          <details key={item.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-navy">
              {item.q}
              <span aria-hidden className="text-navy/40 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
