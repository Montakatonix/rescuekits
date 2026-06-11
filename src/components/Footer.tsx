import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-navy/10 bg-navy text-white/70">
      <div className="container-rk py-10 text-xs leading-relaxed">
        <p className="max-w-3xl">
          RescueKits sells educational templates, checklists and step-by-step processes. We are not
          affiliated with, endorsed by, or connected to Google, Meta, Stripe or Shopify. All
          trademarks belong to their owners. Outcomes depend on your case and are decided solely by
          each platform — no result is guaranteed.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/terms" className="hover:text-teal">Terms</Link>
          <Link href="/privacy" className="hover:text-teal">Privacy</Link>
          <Link href="/refund" className="hover:text-teal">Refund Policy</Link>
          <a href="mailto:support@rescuekits.store" className="hover:text-teal">
            support@rescuekits.store
          </a>
          <span className="ml-auto text-white/40">© {new Date().getFullYear()} RescueKits</span>
        </div>
      </div>
    </footer>
  );
}
