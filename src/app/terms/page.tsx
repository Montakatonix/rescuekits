// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold text-navy">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="container-rk max-w-3xl pt-12">
      <h1 className="font-display text-3xl font-bold text-navy">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: June 2026</p>

      <Section title="1. Who we are">
        <p>
          RescueKits (&ldquo;we&rdquo;) sells digital educational products — guides, templates,
          checklists and trackers — at rescuekits.store. The service is operated by a sole
          proprietorship registered in the Netherlands (KvK registration available on request via
          support@rescuekits.store).
        </p>
      </Section>

      <Section title="2. What you're buying">
        <p>
          Each kit is a downloadable set of educational files (PDF, Word, Excel). Kits describe
          processes, provide templates and organize information. They are{" "}
          <b>not legal, financial or tax advice</b>, and they do not include any service performed
          on your behalf.
        </p>
        <p>
          <b>No outcomes are guaranteed.</b> Reinstatement, review, release and dispute decisions
          are made solely by the relevant platforms (Google, Meta, Stripe, card issuers and others)
          under their own policies. Platform processes change over time; the platform&apos;s own
          notices and documentation are always authoritative.
        </p>
      </Section>

      <Section title="3. License">
        <p>
          Your purchase grants the original purchaser a non-exclusive, non-transferable license to
          use the kit and its templates in their own business or businesses. Redistribution,
          resale, sharing or republication of the kits or templates is not permitted.
        </p>
      </Section>

      <Section title="4. Prices, tax and delivery">
        <p>
          Prices are in EUR. VAT or equivalent tax is calculated at checkout based on your
          location. Delivery is digital and immediate: after payment you receive an access page and
          an access email. Access links are valid for 90 days and renewed free on request.
        </p>
      </Section>

      <Section title="5. Withdrawal right and refunds">
        <p>
          By accepting immediate delivery of digital content at checkout, you expressly consent to
          performance beginning immediately and acknowledge that you thereby waive your 14-day
          statutory right of withdrawal (EU Directive 2011/83/EU). Our own voluntary 14-day
          good-faith refund policy applies instead — see the Refund Policy page.
        </p>
      </Section>

      <Section title="6. Acceptable use">
        <p>
          The kits document official platform processes. You agree not to use them — or anything
          else — to submit false information or altered documents to any platform. We may revoke
          access (with refund, at our discretion) where we believe a purchase supports fraudulent
          activity.
        </p>
      </Section>

      <Section title="7. Liability">
        <p>
          To the maximum extent permitted by law, our liability is limited to the amount you paid
          for the product. We are not liable for platform decisions, lost revenue, or consequential
          damages.
        </p>
      </Section>

      <Section title="8. Trademarks">
        <p>
          Google, Meta, Stripe, Shopify and other names are trademarks of their respective owners,
          used only to identify the platforms the educational content refers to. RescueKits is not
          affiliated with, endorsed by, or connected to any of them.
        </p>
      </Section>

      <Section title="9. Contact & disputes">
        <p>
          Questions and complaints: support@rescuekits.store. These terms are governed by Dutch
          law; EU consumers retain any mandatory protections of their country of residence. EU
          residents may also use the European ODR platform.
        </p>
      </Section>
    </div>
  );
}
