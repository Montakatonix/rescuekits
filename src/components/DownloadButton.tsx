"use client";

import { useState } from "react";

export default function DownloadButton({
  token,
  productKey,
}: {
  token: string;
  productKey: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, productKey }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        const messages: Record<string, string> = {
          rate_limited: "Daily download limit reached — try again tomorrow or contact support.",
          token_expired: "This access link has expired — contact support for a fresh one.",
          token_revoked: "This access link is no longer active — contact support.",
        };
        throw new Error(messages[data.error ?? ""] ?? "Download failed — try again or contact support.");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sm:text-right">
      <button onClick={download} disabled={loading} className="btn-primary !px-5 !py-2 text-sm">
        {loading ? "Preparing…" : "Download ZIP"}
      </button>
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
