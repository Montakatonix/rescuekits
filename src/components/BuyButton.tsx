// src/components/BuyButton.tsx
"use client";

import { useState } from "react";
import { PREVENTION } from "@/lib/catalog";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface Props {
  productKey: "chargeback" | "gbp" | "meta" | "stripe-hold" | "bundle";
  label: string;
  priceEur: number;
  showPreventionBump?: boolean;
  variant?: "primary" | "teal";
}

export default function BuyButton({
  productKey,
  label,
  priceEur,
  showPreventionBump = false,
  variant = "primary",
}: Props) {
  const [withPrevention, setWithPrevention] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    window.gtag?.("event", "begin_checkout", {
      currency: "EUR",
      value: priceEur + (withPrevention ? PREVENTION.priceEur : 0),
      items: [{ item_id: productKey, item_name: productKey, price: priceEur, quantity: 1 }],
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productKey, withPrevention }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong — try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      {showPreventionBump && PREVENTION.active ? (
        <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-lg border border-gold/50 bg-gold/10 p-3 text-sm">
          <input
            type="checkbox"
            checked={withPrevention}
            onChange={(e) => setWithPrevention(e.target.checked)}
            className="mt-1 h-4 w-4 accent-navy"
          />
          <span>
            <b>Add the Prevention Pack (+€{PREVENTION.priceEur})</b> — {PREVENTION.blurb}
          </span>
        </label>
      ) : null}
      <button onClick={buy} disabled={loading} className={variant === "teal" ? "btn-teal" : "btn-primary"}>
        {loading ? "Opening secure checkout…" : label}
      </button>
      <p className="microcopy">One-time payment · Instant access · 14-day good-faith refund</p>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
