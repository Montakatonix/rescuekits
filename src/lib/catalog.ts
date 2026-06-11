// src/lib/catalog.ts
// Single source of truth for products. Prices/copy change = one commit.
// Stripe priceIds come from env so test/live environments stay separate.

export type ProductKey =
  | "chargeback"
  | "gbp"
  | "meta"
  | "stripe-hold"
  | "bundle"
  | "prevention";

export interface FaqItem {
  q: string;
  a: string;
}

export interface Kit {
  key: ProductKey;
  slug: string;
  name: string;
  shortName: string;
  priceEur: number;
  emoji: string;
  cardTagline: string;
  cardBody: string;
  headline: string;
  subhead: string;
  included: string[];
  notIncluded: string[];
  whoFor: string;
  notFor: string;
  faq: FaqItem[];
  deliverablePath: string; // path inside the private "deliverables" bucket
  active: boolean;
}

export const BUNDLE_CONTENTS: ProductKey[] = [
  "chargeback",
  "gbp",
  "meta",
  "stripe-hold",
];

export function stripePriceId(key: ProductKey): string {
  const map: Record<ProductKey, string | undefined> = {
    chargeback: process.env.STRIPE_PRICE_CHARGEBACK,
    gbp: process.env.STRIPE_PRICE_GBP,
    meta: process.env.STRIPE_PRICE_META,
    "stripe-hold": process.env.STRIPE_PRICE_STRIPE_HOLD,
    bundle: process.env.STRIPE_PRICE_BUNDLE,
    prevention: process.env.STRIPE_PRICE_PREVENTION,
  };
  const id = map[key];
  if (!id) throw new Error(`Missing Stripe price id for product "${key}"`);
  return id;
}

/** Reverse lookup: which product does this Stripe price belong to?
 *  Used by the webhook so we never depend on Stripe product metadata.
 *  STRIPE_PRICE_BUNDLE_LAUNCH (optional) lets a temporary launch price
 *  resolve to the bundle too. */
export function productKeyForPriceId(priceId: string): ProductKey | undefined {
  const entries: [ProductKey, string | undefined][] = [
    ["chargeback", process.env.STRIPE_PRICE_CHARGEBACK],
    ["gbp", process.env.STRIPE_PRICE_GBP],
    ["meta", process.env.STRIPE_PRICE_META],
    ["stripe-hold", process.env.STRIPE_PRICE_STRIPE_HOLD],
    ["bundle", process.env.STRIPE_PRICE_BUNDLE],
    ["bundle", process.env.STRIPE_PRICE_BUNDLE_LAUNCH],
    ["prevention", process.env.STRIPE_PRICE_PREVENTION],
  ];
  return entries.find(([, id]) => id && id === priceId)?.[0];
}

export const KITS: Kit[] = [
  {
    key: "chargeback",
    slug: "chargeback-rescue",
    name: "Chargeback Rescue Kit",
    shortName: "Chargeback",
    priceEur: 29,
    emoji: "🟠",
    cardTagline: "I got a chargeback",
    cardBody:
      "A dispute just hit your Shopify/Stripe account. You have days, not weeks. 12 bank-ready response letters, evidence checklists per dispute type, and a 20-minute response system. No 25–30% success fees.",
    headline:
      "Respond to a chargeback in 20 minutes — without paying 25–30% success fees.",
    subhead:
      "For Shopify + Stripe merchants selling physical products. A €400 dispute costs €100–€120 in success fees with a “smart disputes” app. This kit: €29, once, and the letters are yours forever.",
    included: [
      "Main Guide (17-page PDF): First 48 Hours checklist, full decision tree (including when NOT to fight), 4 playbooks by dispute category with evidence checklists per reason code, deadlines & fees table.",
      "12 Response Templates (Word): 3 bank-ready letters per category — Fraud, Not Received, Not as Described, Credit Not Processed — each indexed to its evidence list.",
      "Evidence Pack Builder: the exact folder structure, file naming and attachment order that makes a reviewer's job easy.",
      "“What Not to Say” sheet: the 10 phrases that destroy cases, with the correct replacement for each.",
      "5 De-escalation Emails (Word): resolve the customer before it becomes a dispute.",
      "Dispute Tracker (Excel): deadline alerts, win rate, net recovery, dispute-ratio monitor vs. the ~1% danger zone.",
    ],
    notIncluded: [
      "Anyone responding for you — you submit your own responses (that's why there's no 30% fee)",
      "Coverage for digital products or subscriptions (v1 is physical goods)",
      "Legal advice or guaranteed wins — issuers decide disputes, not us",
    ],
    whoFor:
      "Shopify/Stripe merchants shipping physical products who get 1–10 disputes a month and are tired of renting an app that taxes every win.",
    notFor:
      "You do 50+ disputes/month (you need alert networks + dedicated tooling) or you sell digital/subscriptions (templates assume shipping evidence).",
    faq: [
      {
        q: "Which disputes does it cover?",
        a: "The 4 categories behind the vast majority of merchant chargebacks: Fraudulent, Product Not Received, Not as Described, Credit Not Processed — on Shopify Payments and Stripe.",
      },
      {
        q: "Do the letters actually differ from what the app generates?",
        a: "The letters are indexed to evidence per reason code — the same structure professional representment uses. The difference: you pay once, not 25–30% per win.",
      },
      {
        q: "What's my realistic win rate?",
        a: "Depends on your evidence and dispute mix. Fraud disputes with 3DS or signed delivery are strong; “not as described” without photos is weak. The decision tree tells you which fights are worth your time.",
      },
      {
        q: "I have a dispute due in 3 days — is this fast enough?",
        a: "Yes. The First 48 Hours checklist plus the matching template is a 20-minute workflow once your evidence is gathered.",
      },
    ],
    deliverablePath: "chargeback/v1/Chargeback-Rescue-Kit-v1.zip",
    active: true,
  },
  {
    key: "gbp",
    slug: "gbp-suspension",
    name: "GBP Suspension Rescue Kit",
    shortName: "GBP Suspension",
    priceEur: 49,
    emoji: "🔴",
    cardTagline: "My Google Business Profile got suspended",
    cardBody:
      "Your Google Business Profile vanished from Maps and Search — and your phone went quiet. The reinstatement walkthrough, the evidence Google actually asks for, and the mistakes that turn a soft suspension into a permanent one.",
    headline:
      "Your Google Business Profile is gone from Maps. Don't make the mistake 70% make next.",
    subhead:
      "The reinstatement walkthrough, the evidence Google actually asks for, and the moves that turn a fixable suspension into a permanent one. Written for local businesses whose phone just went silent.",
    included: [
      "Main Guide (17-page PDF): hard vs. soft suspension — how to tell which one you have; the real reasons profiles get flagged; First 24 Hours checklist; the reinstatement request, field by field; realistic timelines and what each status means.",
      "Evidence Pack Builder: the document set Google's reviewers expect — business registration, utility bills, storefront/signage photos, vehicle branding for service-area businesses — with naming and order.",
      "7 Reinstatement Statement Templates (Word): appeal statements per suspension scenario, written to answer what the reviewer is checking — not to plead.",
      "“What Not to Do” sheet: why creating a new profile is the single worst move (and the other 7 case-killers).",
      "Escalation Map: what to do after a denial — the additional review, the official escalation channels, and when a case is realistically dead.",
      "Appeal Tracker (Excel): submission log with automatic day counter, evidence checklist with a “ready to file?” verdict.",
    ],
    notIncluded: [
      "Anyone filing for you, or any backdoor contact at Google — there isn't one, and anyone selling you one is lying",
      "Guaranteed reinstatement — Google decides; profiles that genuinely violated guidelines may stay down",
      "Review-removal or rank/SEO services",
    ],
    whoFor:
      "Local businesses and service-area businesses (real, verifiable operations) suspended after a profile edit, an address change, a rebrand, or out of nowhere.",
    notFor:
      "The profile was for a business that doesn't exist at that location, used a virtual office as a storefront, or keyword-stuffed its name. The kit tells you the truth: some suspensions are deserved and the fix is fixing the business, not the appeal.",
    faq: [
      {
        q: "How long does reinstatement take?",
        a: "Typically days to a few weeks per review round. The kit shows you how to avoid the #1 delay: incomplete evidence forcing a second round.",
      },
      {
        q: "Should I just create a new profile while I wait?",
        a: "No — that's the case-killer. Duplicate profiles violate guidelines and can sink both. The guide covers what to do instead.",
      },
      {
        q: "My suspension says nothing about why. Normal?",
        a: "Yes, most don't. The guide's diagnosis section maps your situation to the likely trigger so your appeal answers the right question.",
      },
      {
        q: "What are my odds?",
        a: "If your business is real, verifiable at its address, and the profile is accurate: appeals succeed routinely. If not, no kit, agency or “expert” can fix it — and we'd rather tell you that for €49 than €500.",
      },
    ],
    deliverablePath: "gbp/v1/GBP-Suspension-Rescue-Kit-v1.zip",
    active: true,
  },
  {
    key: "meta",
    slug: "meta-restricted",
    name: "Meta Ads Restricted Fix Kit",
    shortName: "Meta Restricted",
    priceEur: 59,
    emoji: "🔵",
    cardTagline: "My Meta ads account is restricted or disabled",
    cardBody:
      "Ad account disabled, business restricted, or “advertising access” revoked. Decode which restriction you actually have, prepare the review request properly, and avoid the #1 move that gets merchants permanently banned.",
    headline:
      "Meta shut your ads off overnight. The fix starts with knowing which restriction you have.",
    subhead:
      "Ad account disabled, Business Manager restricted, personal advertising access revoked, payment failures — four different problems, four different fixes. This kit decodes yours and walks you through the review that follows.",
    included: [
      "Main Guide (16-page PDF): the restriction decision tree — identify exactly what's restricted and what that means; the policy-violation map; First 24 Hours checklist; the Request Review process step by step, including identity and business verification prep.",
      "7 Review Request Templates (Word): statement templates per restriction scenario — factual, policy-referenced, no begging — plus the support chat script.",
      "Identity & Business Verification Prep: the documents Meta asks for and the mismatches that cause silent rejections.",
      "“What Not to Do” sheet: why opening a new ad account or borrowing one is ban evasion under Meta's rules — the move that converts a recoverable restriction into a permanent ban.",
      "Ad Account Hygiene SOP: the compliance pre-flight for every campaign relaunch, so the same flag doesn't fire twice.",
      "Case Tracker (Excel): case log with automatic 180-day countdown, verification checklist, and the per-campaign AD PRE-FLIGHT with a launch verdict.",
    ],
    notIncluded: [
      "Anyone “inside Meta” — no agency has a hotline, whatever their sales page says",
      "Guaranteed reinstatement — Meta's review decides, and some violations won't come back",
      "Cloaking, new-account schemes, or any “agency account rental” workaround — that's the path to losing everything permanently",
    ],
    whoFor:
      "Legitimate e-commerce and service advertisers restricted over policy flags, payment issues, ad-rejection pileups, or unexplained “unusual activity”.",
    notFor:
      "The product itself violates ad policies (the kit includes the honest checklist to know before you spend €59).",
    faq: [
      {
        q: "My account says “disabled” — is that final?",
        a: "Usually no. Most disables have a Request Review path with a time window. The guide shows where to find it and how not to waste your one shot.",
      },
      {
        q: "How long does a review take?",
        a: "Hours to weeks; identity verification adds time. The kit covers what to prepare before submitting so you're not the case stuck on a document mismatch.",
      },
      {
        q: "Can I just run ads from a new account meanwhile?",
        a: "That's circumvention under Meta's policies and the most common way merchants convert a temporary restriction into a permanent network-wide ban. The guide covers legitimate ways to keep marketing moving.",
      },
      {
        q: "Will it work for an agency managing client accounts?",
        a: "Yes — the decision tree covers Business Manager and partner-access restrictions too.",
      },
    ],
    deliverablePath: "meta/v1/Meta-Ads-Restricted-Fix-Kit-v1.zip",
    active: true,
  },
  {
    key: "stripe-hold",
    slug: "stripe-payout-hold",
    name: "Stripe Payout Hold Release Kit",
    shortName: "Stripe Payout Hold",
    priceEur: 69,
    emoji: "🟣",
    cardTagline: "Stripe payouts are on hold",
    cardBody:
      "Your revenue is frozen in a payout hold or rolling reserve. How to answer Stripe's risk team with the documents they need, structure your evidence pack, and bridge your cash flow while the review runs.",
    headline:
      "Stripe froze your payouts. Your money isn't gone — but the next email you send matters.",
    subhead:
      "How to answer a Stripe risk review with the documents they actually need, structure your evidence pack, and keep the business breathing while your funds are held.",
    included: [
      "Main Guide (16-page PDF): the 7 hold situations and how to tell yours; the trigger map; the information-request decoder — what each question is really asking; rolling reserves explained with real math; realistic timelines per scenario.",
      "Evidence Pack Builder: the document set that resolves reviews — supplier invoices, fulfillment proof, tracking data, refund policy, business registration — structured the way a risk analyst reads it.",
      "7 Response Templates (Word): replies to information requests, volume-spike reviews, dispute clusters, reserve reductions and terminations — complete, factual, no panic, no over-sharing.",
      "Cash-Flow Bridge Plan: a worksheet to survive 30–120 days of held funds — what to cut, what to negotiate, and how to set up a legitimate secondary processor so one freeze never strangles you again.",
      "“What Not to Say” sheet: the replies that escalate a hold into a termination.",
      "Hold Tracker & Calculators (Excel): communications log with follow-up alerts, rolling-reserve calculator with month-by-month schedule, cash-flow bridge worksheet with runway in weeks.",
    ],
    notIncluded: [
      "Anyone contacting Stripe for you, or any way to “force” a release — funds release on Stripe's schedule after their review",
      "Tricks to move money out during a hold, mask your business model, or open look-alike accounts — that's fraud territory and converts a hold into a ban + funds held the maximum term",
      "Legal advice",
    ],
    whoFor:
      "Merchants with a legitimate business hit by a payout hold, rolling reserve, or sudden “additional information” request — especially after a growth spike, a dispute cluster, or onboarding review.",
    notFor:
      "The hold stems from selling in a prohibited category — no document pack fixes that, and the guide says so on page 2.",
    faq: [
      {
        q: "How long will Stripe hold my money?",
        a: "Reviews: days to weeks. Reserves: commonly 30–120 days rolling. Terminations: typically up to 90–180 days for the final balance. The guide maps each scenario — and your dashboard/emails are always the authoritative source for your account.",
      },
      {
        q: "Can the reserve percentage be negotiated?",
        a: "Sometimes, with evidence: falling dispute ratio, fulfillment proof, processing history. The kit includes the template for making that case at the right moment (not week one).",
      },
      {
        q: "Should I just open a new Stripe account?",
        a: "No. Linked accounts are detected, and circumvention converts a temporary problem into a permanent one. The legitimate alternative — a properly verified secondary processor — is in the Bridge Plan.",
      },
      {
        q: "Is this Stripe-only?",
        a: "The process logic (risk reviews, reserves, evidence packs) applies broadly — PayPal, Shopify Payments, Mollie work similarly — but templates and timelines are written for Stripe.",
      },
    ],
    deliverablePath: "stripe-hold/v1/Stripe-Payout-Hold-Release-Kit-v1.zip",
    active: true,
  },
];

export const BUNDLE = {
  key: "bundle" as ProductKey,
  name: "All-in-One Recovery Bundle",
  priceEur: 119,
  launchPriceEur: 99,
  headline: "One business. Four kill switches. One bundle.",
  subhead:
    "If you're on Google Maps, run Meta ads, and take card payments — any of four platforms can freeze part of your business tomorrow. The All-in-One Recovery Bundle puts every playbook on your shelf before you need it.",
};

export const PREVENTION = {
  key: "prevention" as ProductKey,
  name: "Prevention Pack",
  priceEur: 29,
  blurb:
    "The SOPs that lower the odds of round two: policy-compliance checklists, account-health audits, and the monthly 15-minute review that catches problems before the platform does.",
  deliverablePath: "prevention/v1/Prevention-Pack-v1.zip",
  // v1.1: content not built yet — keep inactive until the ZIP exists in Storage.
  active: false,
};

export function kitBySlug(slug: string): Kit | undefined {
  return KITS.find((k) => k.slug === slug);
}

export function kitByKey(key: string): Kit | undefined {
  return KITS.find((k) => k.key === key);
}

export function productName(key: ProductKey): string {
  if (key === "bundle") return BUNDLE.name;
  if (key === "prevention") return PREVENTION.name;
  return kitByKey(key)?.name ?? key;
}

export const KITS_TOTAL_EUR = KITS.reduce((s, k) => s + k.priceEur, 0); // 206
