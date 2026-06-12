// src/app/access/page.tsx
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { kitByKey, productName, type ProductKey } from "@/lib/catalog";
import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";

export const metadata: Metadata = { title: "Your kits", robots: { index: false } };
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="container-rk max-w-2xl pt-14">{children}</div>;
}

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Shell>
        <div className="rounded-xl border border-navy/10 bg-white p-8">
          <h1 className="font-display text-2xl font-bold text-navy">Access your kits</h1>
          <p className="mt-3 text-ink/80">
            Open the link from your &ldquo;Your RescueKits access&rdquo; email — it brings you
            straight here. Can&apos;t find it? Email{" "}
            <a className="font-semibold text-teal-dark underline" href="mailto:support@rescuekits.store">
              support@rescuekits.store
            </a>{" "}
            from your purchase email and we&apos;ll resend it within 24h.
          </p>
        </div>
      </Shell>
    );
  }

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const { data: tokenRow } = uuidRe.test(token)
    ? await supabaseAdmin
        .from("access_tokens")
        .select("token, order_id, email, expires_at, revoked, created_at")
        .eq("token", token)
        .maybeSingle()
    : { data: null };

  if (!tokenRow) {
    return (
      <Shell>
        <div className="rounded-xl border border-navy/10 bg-white p-8">
          <h1 className="font-display text-2xl font-bold text-navy">This link isn&apos;t valid.</h1>
          <p className="mt-3 text-ink/80">
            Check you copied the full URL from your email, or contact{" "}
            <a className="font-semibold text-teal-dark underline" href="mailto:support@rescuekits.store">
              support@rescuekits.store
            </a>
            .
          </p>
        </div>
      </Shell>
    );
  }

  const expired = tokenRow.revoked || new Date(tokenRow.expires_at) < new Date();
  if (expired) {
    return (
      <Shell>
        <div className="rounded-xl border border-navy/10 bg-white p-8">
          <h1 className="font-display text-2xl font-bold text-navy">
            This access link has expired.
          </h1>
          <p className="mt-3 text-ink/80">
            No problem — your purchase hasn&apos;t. Email{" "}
            <a className="font-semibold text-teal-dark underline" href="mailto:support@rescuekits.store">
              support@rescuekits.store
            </a>{" "}
            from your purchase email and we&apos;ll send a fresh link within 24h.
          </p>
        </div>
      </Shell>
    );
  }

  const { data: entitlements } = await supabaseAdmin
    .from("entitlements")
    .select("product_key")
    .eq("order_id", tokenRow.order_id)
    .order("created_at", { ascending: true });

  // audit: access page viewed
  await supabaseAdmin.from("events").insert({
    type: "access_viewed",
    order_id: tokenRow.order_id,
    token,
  });

  const keys = (entitlements ?? []).map((e) => e.product_key as ProductKey);
  const downloadable = keys.filter((k) => kitByKey(k)); // only kits have files (v1)
  const purchasedDate = new Date(tokenRow.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Shell>
      <h1 className="font-display text-3xl font-bold text-navy">Your kits</h1>
      <p className="mt-2 text-sm text-ink/70">
        Purchased on {purchasedDate} · {tokenRow.email}. Downloads are generated fresh each time
        and links expire after 15 minutes — just click again whenever you need a file.
      </p>

      <div className="mt-6 space-y-4">
        {downloadable.map((key) => {
          const kit = kitByKey(key)!;
          return (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-xl border border-navy/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display font-semibold text-navy">
                  {kit.emoji} {kit.name} <span className="text-xs font-normal text-ink/50">v1</span>
                </p>
                <p className="mt-0.5 text-xs text-ink/60">Guide PDF + templates + tracker (ZIP)</p>
              </div>
              <DownloadButton token={token} productKey={key} />
            </div>
          );
        })}
        {downloadable.length === 0 ? (
          <p className="rounded-xl border border-navy/10 bg-white p-5 text-sm text-ink/70">
            No downloadable items found on this order. Contact support@rescuekits.store.
          </p>
        ) : null}
      </div>

      {downloadable.length < 4 ? (
        <div className="mt-8 rounded-xl bg-navy p-5 text-white">
          <p className="font-display font-semibold">Unlock the full shelf.</p>
          <p className="mt-1 text-sm text-white/75">
            The All-in-One Bundle puts all 4 playbooks here, before the next fire.
          </p>
          <Link href="/bundle" className="btn-teal mt-4 !px-5 !py-2 text-sm">
            Upgrade to the bundle →
          </Link>
        </div>
      ) : null}
    </Shell>
  );
}
