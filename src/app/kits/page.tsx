// src/app/kits/page.tsx
import type { Metadata } from "next";
import KitCard from "@/components/KitCard";
import BundleBanner from "@/components/BundleBanner";
import { KITS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All kits",
  description:
    "Each kit covers one platform emergency end-to-end: what to do in the first 24 hours, what evidence to gather, what to write, and what never to say.",
};

export default function KitsPage() {
  return (
    <div className="container-rk pt-12">
      <h1 className="font-display text-3xl font-bold text-navy">Four fires. Four playbooks.</h1>
      <p className="mt-3 max-w-2xl text-ink/75">
        Each kit covers one platform emergency end-to-end: what to do in the first 24 hours, what
        evidence to gather, what to write, and what never to say.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {KITS.map((kit) => (
          <KitCard key={kit.key} kit={kit} />
        ))}
      </div>
      <div className="mt-10">
        <BundleBanner />
      </div>
    </div>
  );
}
