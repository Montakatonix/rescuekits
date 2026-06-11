# RescueKits — Platform Recovery Hub

One hub, four recovery kits, Stripe Checkout, automated secure delivery.

## Stack
Next.js 15 (App Router) · TypeScript strict · Tailwind · Stripe Checkout + webhooks ·
Supabase (Postgres + private Storage) · Resend · GA4 · Vercel.

## How money flows
1. `BuyButton` → `POST /api/checkout` → Stripe Checkout (automatic tax, promo codes,
   EU withdrawal-waiver consent).
2. Stripe → `POST /api/webhook` (signature-verified, deduped via `stripe_events` PK):
   creates `orders`, `order_items`, `entitlements` (bundle expands to 4 kits),
   a 90-day `access_token`, logs everything to `events`, sends the access email.
3. Buyer lands on `/thank-you?session_id=…` which polls `/api/order-status`
   (webhook race-condition bridge) and fires the GA4 `purchase` event.
4. `/access?token=…` lists entitlements; `Download ZIP` → `POST /api/download`
   validates token + entitlement + rate limit, signs a 15-minute Storage URL,
   logs `download_issued` with IP/UA — the chargeback-defense evidence trail.
5. `charge.refunded` / `charge.dispute.created` webhooks mark the order and revoke access.

## Setup
1. `npm install`
2. Supabase: run `supabase/migrations/001_init.sql` (creates tables, RLS, private
   `deliverables` bucket). Upload kit ZIPs to the paths in `src/lib/catalog.ts`.
3. Stripe: create the 6 products/prices (metadata `product_key` on each product),
   enable Stripe Tax, add a webhook endpoint for
   `checkout.session.completed`, `charge.refunded`, `charge.dispute.created`
   → `https://<domain>/api/webhook`.
4. Copy `.env.example` → configure all vars (test keys first).
5. `npm run dev`, test with Stripe test cards, then flip to live keys.

## Conventions
- The catalog (`src/lib/catalog.ts`) is the single source of truth for products,
  prices shown, copy and deliverable paths. Price IDs come from env per environment.
- The browser never talks to Supabase; all tables have RLS with zero public policies.
- `/thank-you` only reads; the webhook is the only writer of orders.
