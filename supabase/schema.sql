-- =====================================================================
-- Sada Simpal — database schema
-- Run this ONCE in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- It is safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).
--
-- Security model:
--   * The website (anonymous visitors) can only INSERT new rows into
--     orders, custom_requests, contact_messages, newsletter_subscribers
--     and reviews (reviews start unapproved).
--   * Visitors can NEVER read orders, messages or subscribers.
--   * Visitors can read only APPROVED reviews.
--   * You read/manage everything from the Supabase dashboard (Table Editor),
--     or later through the admin panel (signed-in "authenticated" role).
-- =====================================================================

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  customer_name  text not null check (char_length(customer_name) between 2 and 120),
  phone          text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email          text,
  address_line1  text not null check (char_length(address_line1) between 5 and 300),
  address_line2  text,
  city           text not null,
  state          text not null,
  pincode        text not null check (pincode ~ '^[1-9][0-9]{5}$'),
  notes          text check (char_length(notes) <= 500),
  payment_method text not null check (payment_method in ('cod','upi')),
  items          jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 50),
  subtotal       numeric(10,2) not null check (subtotal >= 0),
  shipping       numeric(10,2) not null check (shipping >= 0),
  total          numeric(10,2) not null check (total >= 0),
  status         text not null default 'pending'
                 check (status in ('pending','confirmed','making','shipped','delivered','cancelled')),
  tracking_info  text,
  created_at     timestamptz not null default now()
);

-- ---------- CUSTOM ORDER REQUESTS ----------
create table if not exists public.custom_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  phone       text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email       text,
  item_type   text not null,
  budget      text,
  needed_by   date,
  details     text not null check (char_length(details) between 15 and 2000),
  status      text not null default 'new' check (status in ('new','quoted','accepted','done','declined')),
  created_at  timestamptz not null default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null,
  phone       text,
  message     text not null check (char_length(message) between 10 and 2000),
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------- NEWSLETTER ----------
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at  timestamptz not null default now()
);

-- ---------- REVIEWS (you already have this table; this is a no-op if so) ----------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  text        text not null,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.orders                 enable row level security;
alter table public.custom_requests        enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.reviews                enable row level security;

-- Visitors may only create rows…
drop policy if exists "public can place orders" on public.orders;
create policy "public can place orders" on public.orders
  for insert to anon, authenticated
  with check (status = 'pending');          -- can't self-mark as confirmed/shipped

drop policy if exists "public can request custom orders" on public.custom_requests;
create policy "public can request custom orders" on public.custom_requests
  for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists "public can send messages" on public.contact_messages;
create policy "public can send messages" on public.contact_messages
  for insert to anon, authenticated
  with check (handled = false);

drop policy if exists "public can subscribe" on public.newsletter_subscribers;
create policy "public can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

-- Reviews: anyone can submit (unapproved) and read only approved ones.
drop policy if exists "public can submit reviews" on public.reviews;
create policy "public can submit reviews" on public.reviews
  for insert to anon, authenticated
  with check (approved = false);

drop policy if exists "public can read approved reviews" on public.reviews;
create policy "public can read approved reviews" on public.reviews
  for select to anon, authenticated
  using (approved = true);

-- NOTE: no SELECT/UPDATE/DELETE policies exist for orders, custom_requests,
-- contact_messages or newsletter_subscribers, so visitors cannot read them.
-- The Supabase dashboard (service role) bypasses RLS, so you can always see
-- and manage everything there.

-- =====================================================================
-- Helpful: a view of new work for you in the dashboard
-- =====================================================================
create or replace view public.todo_overview
with (security_invoker = true) as   -- respects the table security rules above
select 'order'::text as kind, order_number as ref, customer_name as who, total::text as info, created_at
  from public.orders where status = 'pending'
union all
select 'custom', id::text, name, item_type, created_at
  from public.custom_requests where status = 'new'
union all
select 'message', id::text, name, left(message, 60), created_at
  from public.contact_messages where handled = false
order by created_at desc;

-- Belt and braces: the website (anon / signed-in customers) must never touch this view.
revoke all on public.todo_overview from anon, authenticated;
