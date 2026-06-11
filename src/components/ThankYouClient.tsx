// src/components/ThankYouClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type OrderStatus =
  | { status: "processing" | "unpaid" }
  | {
      status: "ready";
      token: string;
      email: string;
      purchasedKeys: string[];
      amountTotal: number | null;
      currency: string | null;
    };

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 15; // ~30s before the email fallback

export default function ThankYouClient({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<"loading" | "ready" | "fallback" | "invalid">("loading");
  const [data, setData] = useState<Extract<OrderStatus, { status: "ready" }> | null>(null);
  const purchaseFired = useRef(false);

  useEffect(() => {
    let polls = 0;
    let cancelled = false;

    async function poll() {
      polls += 1;
      try {
        const res = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
        if (res.status === 400) {
          if (!cancelled) setState("invalid");
          return;
        }
        const json = (await res.json()) as OrderStatus & { error?: string };
        if (cancelled) return;
        if (json.status === "ready") {
          setData(json);
          setState("ready");
          if (!purchaseFired.current) {
            purchaseFired.current = true;
            window.gtag?.("event", "purchase", {
              transaction_id: sessionId,
              currency: (json.currency ?? "eur").toUpperCase(),
              value: (json.amountTotal ?? 0) / 100,
              items: json.purchasedKeys.map((k) => ({ item_id: k, item_name: k, quantity: 1 })),
            });
          }
          return;
        }
        if (json.status === "unpaid") {
          setState("invalid");
          return;
        }
      } catch {
        // network hiccup — keep polling
      }
      if (polls >= MAX_POLLS) {
        if (!cancelled) setState("fallback");
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (state === "loading") {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-navy">
          Payment received. Preparing your access…
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          This takes a few seconds. Don&apos;t close this page.
        </p>
        <div className="mx-auto mt-6 h-2 w-48 overflow-hidden rounded-full bg-navy/10">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-teal" />
        </div>
      </div>
    );
  }

  if (state === "ready" && data) {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8">
        <h1 className="font-display text-3xl font-bold text-navy">
          You&apos;re in. Here&apos;s your access.
        </h1>
        <p className="mt-3 leading-relaxed text-ink/80">
          Your kits are ready below — and we&apos;ve emailed your permanent access link to{" "}
          <b>{data.email}</b> (subject: &ldquo;Your RescueKits access&rdquo;). Bookmark it;
          it&apos;s valid for 90 days and we can renew it any time.
        </p>
        <Link href={`/access?token=${data.token}`} className="btn-teal mt-6">
          Open my kits →
        </Link>
        <p className="mt-4 text-xs text-ink/60">
          Don&apos;t see the email in 5 minutes? Check spam, or just use the button above —
          it&apos;s the same access.
        </p>
        {!data.purchasedKeys.includes("bundle") ? (
          <div className="mt-8 rounded-lg bg-navy p-5 text-white">
            <p className="font-display font-semibold">
              You bought {data.purchasedKeys.length} of 4. Complete the shelf:
            </p>
            <p className="mt-1 text-sm text-white/75">
              Upgrade to the All-in-One Bundle and have every playbook before the next fire.
            </p>
            <Link href="/bundle" className="btn-teal mt-4 !px-5 !py-2 text-sm">
              Upgrade →
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  if (state === "fallback") {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8">
        <h1 className="font-display text-2xl font-bold text-navy">Payment received.</h1>
        <p className="mt-3 leading-relaxed text-ink/80">
          Your payment went through, but our delivery system is taking longer than it should. Your
          access email will arrive within a few minutes. If it doesn&apos;t:{" "}
          <a className="font-semibold text-teal-dark underline" href="mailto:support@rescuekits.store">
            support@rescuekits.store
          </a>{" "}
          with your receipt — a human answers within 24h.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-8">
      <h1 className="font-display text-2xl font-bold text-navy">
        We couldn&apos;t verify this checkout.
      </h1>
      <p className="mt-3 text-ink/80">
        If you completed a payment, check your inbox for the access email, or contact{" "}
        <a className="font-semibold text-teal-dark underline" href="mailto:support@rescuekits.store">
          support@rescuekits.store
        </a>{" "}
        with your receipt.
      </p>
    </div>
  );
}
