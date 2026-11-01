-- =====================================================================
-- Sada Simpal — database upgrade (v2): products, sizes/colours, stock,
-- admin logins, image storage and SERVER-CHECKED orders.
--
-- Run ONCE in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Run AFTER schema.sql. Safe to re-run.
--
-- What changes for security:
--   * Prices now live in the database. The website can no longer write
--     orders directly — it must call place_order(), which re-reads the real
--     prices, checks stock, adds shipping and saves the order. Nobody can
--     change a price from their browser any more.
--   * Only people listed in the `admins` table (you and Sakshi) can add or
--     edit products, see orders/messages/subscribers, or upload photos.
-- =====================================================================

-- ---------- ADMINS ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins can see admins" on public.admins;
create policy "admins can see admins" on public.admins
  for select to authenticated using (public.is_admin());
-- (admins are added only from the SQL editor — see GO_LIVE_GUIDE.md)

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  slug        text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null check (char_length(name) between 2 and 80),
  description text not null default '',
  image       text not null default '',
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name             text not null check (char_length(name) between 2 and 150),
  short_description text not null default '',
  description      text not null default '',
  category_slug    text not null references public.categories(slug) on update cascade,
  images           text[] not null default '{}',
  compare_at_price numeric(10,2) check (compare_at_price is null or compare_at_price > 0),
  material         text not null default '',
  care             text[] not null default '{}',
  features         text[] not null default '{}',
  is_active        boolean not null default true,
  is_bestseller    boolean not null default false,
  is_new           boolean not null default false,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_slug);

-- ---------- VARIANTS (size / colour / price / stock) ----------
create table if not exists public.product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  size          text not null default 'One Size',
  color         text not null default '',
  color_hex     text not null default '',
  price         numeric(10,2) not null check (price > 0),
  stock         int  not null default 0 check (stock >= 0),
  made_to_order boolean not null default false,   -- true = always available, stock ignored
  is_active     boolean not null default true,
  sort_order    int  not null default 0,
  unique (product_id, size, color)
);
create index if not exists variants_product_idx on public.product_variants(product_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------- ROW LEVEL SECURITY ----------
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;

drop policy if exists "public reads active categories" on public.categories;
create policy "public reads active categories" on public.categories
  for select to anon, authenticated using (is_active);

drop policy if exists "public reads active products" on public.products;
create policy "public reads active products" on public.products
  for select to anon, authenticated using (is_active);

drop policy if exists "public reads active variants" on public.product_variants;
create policy "public reads active variants" on public.product_variants
  for select to anon, authenticated
  using (is_active and exists (select 1 from public.products p where p.id = product_id and p.is_active));

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage variants" on public.product_variants;
create policy "admins manage variants" on public.product_variants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admins can also see the inactive (hidden) ones — covered by the "for all" policies above.

-- ---------- ORDERS: lock the front door, give admins the keys ----------
-- Customers can no longer insert orders directly; they must use place_order().
drop policy if exists "public can place orders" on public.orders;
revoke insert, update, delete on public.orders from anon;

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());
drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete orders" on public.orders;
create policy "admins delete orders" on public.orders
  for delete to authenticated using (public.is_admin());

-- Customers who are "signed in" (nobody should be, signups are off) get nothing extra:
-- the old "to anon, authenticated" insert policies on the other tables stay insert-only.

drop policy if exists "admins read custom_requests" on public.custom_requests;
create policy "admins read custom_requests" on public.custom_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage messages" on public.contact_messages;
create policy "admins manage messages" on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage subscribers" on public.newsletter_subscribers;
create policy "admins manage subscribers" on public.newsletter_subscribers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage reviews" on public.reviews;
create policy "admins manage reviews" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- PLACE ORDER (the only way an order is created) ----------
-- p_customer: {name, phone, email, address1, address2, city, state, pincode, notes, payment}
-- p_items:    [{variant_id, quantity}, ...]
-- Prices, stock and shipping are decided HERE, never by the browser.
create or replace function public.place_order(p_customer jsonb, p_items jsonb)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  -- KEEP THESE IN SYNC with SITE.shipping in src/lib/site.ts
  c_free_above constant numeric := 999;
  c_flat_fee   constant numeric := 60;
  c_max_qty    constant int     := 10;
  c_alphabet   constant text    := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  v_item     jsonb;
  v_var      record;
  v_qty      int;
  v_subtotal numeric := 0;
  v_shipping numeric;
  v_total    numeric;
  v_lines    jsonb := '[]'::jsonb;
  v_number   text;
  v_tries    int := 0;
  v_phone    text;
  v_payment  text;
  v_suffix   text;
begin
  if p_customer is null or jsonb_typeof(p_customer) <> 'object' then
    raise exception 'INVALID_CUSTOMER';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'INVALID_ITEMS';
  end if;

  v_payment := coalesce(p_customer->>'payment', '');
  if v_payment not in ('cod','upi') then raise exception 'INVALID_PAYMENT'; end if;
  v_phone := right(regexp_replace(coalesce(p_customer->>'phone',''), '\D', '', 'g'), 10);

  -- lock rows in a stable order so two simultaneous orders can't deadlock
  for v_item in
    select value from jsonb_array_elements(p_items) order by value->>'variant_id'
  loop
    if coalesce(v_item->>'variant_id','') !~ '^[0-9a-fA-F-]{36}$'
       or coalesce(v_item->>'quantity','') !~ '^[0-9]{1,3}$' then
      raise exception 'INVALID_ITEMS';
    end if;
    v_qty := (v_item->>'quantity')::int;
    if v_qty < 1 or v_qty > c_max_qty then raise exception 'INVALID_QUANTITY'; end if;

    select v.id, v.size, v.color, v.price, v.stock, v.made_to_order, v.is_active,
           p.name as product_name, p.slug, p.images, p.is_active as product_active
      into v_var
      from public.product_variants v
      join public.products p on p.id = v.product_id
     where v.id = (v_item->>'variant_id')::uuid
       for update of v;

    if not found or not v_var.is_active or not v_var.product_active then
      raise exception 'UNAVAILABLE:%', coalesce(v_var.product_name, 'an item');
    end if;
    if not v_var.made_to_order and v_var.stock < v_qty then
      raise exception 'OUT_OF_STOCK:%:%', v_var.product_name, v_var.stock;
    end if;
    if not v_var.made_to_order then
      update public.product_variants set stock = stock - v_qty where id = v_var.id;
    end if;

    v_subtotal := v_subtotal + v_var.price * v_qty;
    v_lines := v_lines || jsonb_build_object(
      'variant_id', v_var.id,
      'id',         v_var.slug,
      'name',       v_var.product_name,
      'size',       v_var.size,
      'color',      v_var.color,
      'price',      v_var.price,
      'quantity',   v_qty,
      'image',      coalesce(v_var.images[1], '')
    );
  end loop;

  v_shipping := case when v_subtotal >= c_free_above then 0 else c_flat_fee end;
  v_total := v_subtotal + v_shipping;

  loop
    v_tries := v_tries + 1;
    v_suffix := '';
    for i in 1..4 loop
      v_suffix := v_suffix || substr(c_alphabet, floor(random() * 32)::int + 1, 1);
    end loop;
    v_number := 'SS-' || to_char(timezone('Asia/Kolkata', now()), 'YYMMDD') || '-' || v_suffix;
    begin
      insert into public.orders (
        order_number, customer_name, phone, email, address_line1, address_line2,
        city, state, pincode, notes, payment_method, items, subtotal, shipping, total
      ) values (
        v_number,
        trim(coalesce(p_customer->>'name','')),
        v_phone,
        nullif(trim(coalesce(p_customer->>'email','')), ''),
        trim(coalesce(p_customer->>'address1','')),
        nullif(trim(coalesce(p_customer->>'address2','')), ''),
        trim(coalesce(p_customer->>'city','')),
        trim(coalesce(p_customer->>'state','')),
        trim(coalesce(p_customer->>'pincode','')),
        nullif(trim(coalesce(p_customer->>'notes','')), ''),
        v_payment, v_lines, v_subtotal, v_shipping, v_total
      );
      exit;
    exception when unique_violation then
      if v_tries >= 5 then raise; end if;
    end;
  end loop;

  return jsonb_build_object(
    'order_number', v_number,
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total', v_total,
    'items', v_lines
  );
end $$;

revoke all on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;

-- ---------- Cancelling an order puts the stock back ----------
create or replace function public.restore_stock_on_cancel()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare r record;
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    for r in
      select nullif(i->>'variant_id','')::uuid as vid, (i->>'quantity')::int as qty
        from jsonb_array_elements(old.items) i
    loop
      if r.vid is not null then
        update public.product_variants
           set stock = stock + r.qty
         where id = r.vid and not made_to_order;
      end if;
    end loop;
  end if;
  return new;
end $$;

drop trigger if exists orders_restore_stock on public.orders;
create trigger orders_restore_stock after update of status on public.orders
  for each row execute function public.restore_stock_on_cancel();

-- ---------- PHOTO STORAGE ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "product images are public" on storage.objects;
create policy "product images are public" on storage.objects
  for select using (bucket_id = 'product-images');
drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admins change product images" on storage.objects;
create policy "admins change product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
