-- supabase/migrations/001_init.sql
-- RescueKits v1 schema. All tables: RLS enabled, ZERO public policies —
-- only the service role (server-side) can touch them.

create extension if not exists pgcrypto;

-- ───────────────────────── orders ─────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,        -- idempotency anchor
  stripe_payment_intent_id text,
  email text not null,
  amount_total_cents int not null,
  currency text not null default 'eur',
  status text not null default 'paid' check (status in ('paid','refunded','disputed')),
  country text,
  created_at timestamptz not null default now()
);

-- ─────────────────────── order_items ──────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_key text not null,
  price_cents int,
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ─────────────────────── entitlements ─────────────────────
-- bundle purchases EXPAND into one row per contained kit
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  email text not null,
  product_key text not null,
  created_at timestamptz not null default now(),
  unique(order_id, product_key)
);
create index if not exists entitlements_email_idx on public.entitlements(email);
create index if not exists entitlements_order_idx on public.entitlements(order_id);

-- ─────────────────────── access_tokens ────────────────────
create table if not exists public.access_tokens (
  token uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  email text not null,
  expires_at timestamptz not null default now() + interval '90 days',
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists access_tokens_order_idx on public.access_tokens(order_id);

-- ───────────────────────── events ─────────────────────────
-- the audit log: this table is the chargeback-defense evidence
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null,        -- order_created | email_sent | email_failed | access_viewed
                             -- download_issued | download_denied | webhook_duplicate
                             -- order_refunded | order_disputed
  order_id uuid,
  token uuid,
  product_key text,
  ip text,
  user_agent text,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_order_idx on public.events(order_id);
create index if not exists events_token_idx on public.events(token);
create index if not exists events_type_created_idx on public.events(type, created_at);

-- ──────────────────────── stripe_events ───────────────────
-- webhook dedup: PK = Stripe event id; duplicate insert -> conflict -> skip
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  payload jsonb,
  received_at timestamptz not null default now()
);

-- ──────────────────────────── RLS ─────────────────────────
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.entitlements   enable row level security;
alter table public.access_tokens  enable row level security;
alter table public.events         enable row level security;
alter table public.stripe_events  enable row level security;
-- intentionally NO policies: anon/authenticated can do nothing;
-- the service role bypasses RLS and is only used server-side.

-- ─────────────────────── storage bucket ───────────────────
-- private bucket for the kit ZIPs; files served only via signed URLs
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;
