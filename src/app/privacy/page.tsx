// src/app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold text-navy">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="container-rk max-w-3xl pt-12">
      <h1 className="font-display text-3xl font-bold text-navy">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: June 2026</p>

      <Section title="1. Controller">
        <p>
          RescueKits, operated by a sole proprietorship registered in the Netherlands. Contact:
          support@rescuekits.store.
        </p>
      </Section>

      <Section title="2. What we process, and why">
        <p>
          <b>Purchase data</b> (email, country, amount, products bought): to deliver your purchase
          and keep required accounting records. Legal basis: performance of contract; legal
          obligation (tax).
        </p>
        <p>
          <b>Payment data:</b> handled entirely by Stripe — we never see or store card numbers.
        </p>
        <p>
          <b>Delivery and access logs</b> (access-page visits, downloads, with IP address and
          browser user-agent): to deliver files securely, prevent abuse, and document delivery in
          the event of a payment dispute. Legal basis: performance of contract; legitimate interest
          (fraud prevention and dispute defense).
        </p>
        <p>
          <b>Email:</b> we send the transactional access email for your purchase. No marketing
          emails without separate consent.
        </p>
        <p>
          <b>Analytics:</b> basic, aggregated usage analytics (Google Analytics 4) to understand
          site performance.
        </p>
      </Section>

      <Section title="3. Processors">
        <p>
          Stripe (payments &amp; tax calculation), Supabase (database &amp; file storage), Resend
          (transactional email), Vercel (hosting), Google Analytics (analytics). Each processes
          data under its own data-processing agreement.
        </p>
      </Section>

      <Section title="4. Retention">
        <p>
          Order records: 7 years (Dutch tax law). Delivery/access logs: 24 months, or longer where
          needed for an active payment dispute. Access tokens expire after 90 days (renewable).
        </p>
      </Section>

      <Section title="5. Your rights">
        <p>
          Under the GDPR you can request access, correction, deletion, restriction, portability,
          and object to legitimate-interest processing: email support@rescuekits.store. You can
          also complain to the Dutch DPA (Autoriteit Persoonsgegevens) or your local authority.
        </p>
      </Section>

      <Section title="6. International transfers">
        <p>
          Some processors operate globally; transfers outside the EEA rely on adequacy decisions or
          standard contractual clauses maintained by those processors.
        </p>
      </Section>
    </div>
  );
}
