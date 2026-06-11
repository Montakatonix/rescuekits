import Link from "next/link";
import { BUNDLE, KITS_TOTAL_EUR } from "@/lib/catalog";

export default function BundleBanner({ currentPriceEur }: { currentPriceEur?: number }) {
  return (
    <div className="rounded-xl border border-teal/40 bg-navy p-6 text-white">
      <p className="font-display text-lg font-semibold">
        {currentPriceEur
          ? `This kit: €${currentPriceEur}. All four: €${BUNDLE.priceEur}.`
          : `All 4 kits for €${BUNDLE.priceEur} instead of €${KITS_TOTAL_EUR}.`}
      </p>
      <p className="mt-1 text-sm text-white/70">
        If you run ads AND take card payments, the next fire is a when, not an if.
      </p>
      <Link href="/bundle" className="btn-teal mt-4 !px-5 !py-2.5 text-sm">
        {currentPriceEur ? "Upgrade to the bundle →" : `Get the bundle — save ${Math.round((1 - BUNDLE.priceEur / KITS_TOTAL_EUR) * 100)}%`}
      </Link>
    </div>
  );
}
