// src/app/thank-you/page.tsx
import type { Metadata } from "next";
import ThankYouClient from "@/components/ThankYouClient";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return (
    <div className="container-rk max-w-2xl pt-14">
      {session_id ? (
        <ThankYouClient sessionId={session_id} />
      ) : (
        <div className="rounded-xl border border-navy/10 bg-white p-8">
          <h1 className="font-display text-2xl font-bold text-navy">Missing checkout reference.</h1>
          <p className="mt-3 text-ink/80">
            If you completed a payment, your access email is on its way. Otherwise, head back to the
            kits.
          </p>
        </div>
      )}
    </div>
  );
}
