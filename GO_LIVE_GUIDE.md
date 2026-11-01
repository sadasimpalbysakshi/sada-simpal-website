# Sada Simpal — Go-Live & Phase 2 Guide

Plan: **real store** (Supabase Pro + own domain + free hosting + Razorpay).
Approx. running cost: ~₹2,300/month + ~₹900–1,500/year domain + 2.36% on online payments.

**Legend:** 🧑 = you do it (needs your accounts/ID/payment) · 🤖 = Claude builds it in your code.

Do the steps in order. Each step says what you get at the end.

---

## STEP 0 — Right now (free, 30 minutes)
🧑 1. Free up disk space on your Mac (it was nearly full — this blocked some tools).
🧑 2. Open `src/lib/site.ts` and check: WhatsApp number, phone, email, Instagram, shipping rule
   (free above ₹999 / ₹60 fee), UPI ID.
🧑 3. Read `src/content/policies.ts` and the About page text. Change anything that isn't true for
   your business. (They are drafts, not legal advice.)
🧑 4. Run `npm run dev` and click through the whole site on your phone too
   (same Wi-Fi → open `http://<your-mac-ip>:5173`).

## STEP 1 — Supabase: database + login (Day 1)
You already have a project. Make it production-ready.
🧑 1. supabase.com → your project → **SQL Editor → New query** → paste all of
   `supabase/schema.sql` → **Run**. (Creates orders, custom/bulk requests, messages, newsletter, reviews + security rules.)
🧑 2. **Test:** place a test order on your local site. Then Supabase → **Table Editor → orders** → you should see it.
🧑 3. **Authentication → Providers → Email:** turn **OFF "Allow new users to sign up"** (so only you can log in).
🧑 4. **Authentication → Users → Add user** → create *your* admin login (email + strong password).
🧑 5. Before launch week: **Settings → Billing → upgrade to Pro ($25/month)**. This stops the project
   pausing after a week of quiet and turns on daily backups. Set a **spend cap** so you never get a surprise bill.
🧑 6. Settings → API: copy **Project URL** and **anon key** (public) into a new `.env.local` file (see `.env.example`).
   ⚠️ NEVER put the `service_role` key in your website code.

✅ Result: orders, enquiries and messages are safely stored.

## STEP 2 — Domain name (Day 1)
🧑 1. Pick a name that matches your brand, e.g. `sadasimpal.in` (check it's free and not trademarked).
🧑 2. Buy it from Hostinger / GoDaddy / Namecheap. (First year is often ₹1, renewal ≈ ₹899 for `.in`.)
   Use your own email + mobile number as the owner (not a developer's) and turn on auto-renew.
🧑 3. Also create a business email if you like (e.g. `hello@sadasimpal.in`) — many registrars include forwarding.

✅ Result: you own the address.

## STEP 3 — Clean URLs (no `#`) + hosting (Day 2)
🤖 **Claude does:** switch `HashRouter` → `BrowserRouter`, set `base: "/"`, add the redirect file so
refreshing a page works, add `sitemap.xml`, canonical tags, and pre-render the product/category pages so
Google can read them.
🧑 **You do:**
1. Make sure your code is on GitHub (`kishan6342/style-hub`).
2. Create a free account on **Cloudflare Pages** (or **Netlify**). ⚠️ Don't use Vercel's free plan — it
   doesn't allow commercial shops.
3. **Create project → connect GitHub repo.** Build command: `npm run build` · Output folder: `dist`.
4. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
5. **Custom domain** → add your domain → copy the DNS records they show into your domain registrar's DNS page.
   HTTPS turns on automatically (can take up to a few hours).
6. Supabase → **Authentication → URL Configuration** → set **Site URL** to `https://yourdomain.in`.

✅ Result: `https://yourdomain.in/product/b1` style links; every `git push` redeploys automatically.

## STEP 4 — Products move into the database (Day 3–4)
Today the 13 products live in `src/data/products.ts`, and the browser calculates prices. Anyone
technical could change a price in their browser before paying. We fix that.

🤖 **Claude builds:**
- `products` and `categories` tables (name, price, description, images, stock, category, featured flags).
- A one-time script that imports your existing 13 products.
- Product images stored in **Supabase Storage** (fast CDN) instead of the code folder.
- The site reads products live from the database — **no redeploy needed to add a product**.
- **Server-side order function:** when the customer clicks "Place order", the *server* looks up the real
  prices, adds shipping, and saves the true total. Prices sent by the browser are ignored.
🧑 **You do:** run the SQL file Claude gives you in the SQL Editor, and give me better product
names/photos/prices (see "Content to prepare" below).

✅ Result: tamper-proof pricing, and products editable from a dashboard.

## STEP 5 — Admin panel (Day 4–6)
🤖 **Claude builds** a private page at `/admin` (login with the user from Step 1):
- **Products:** add / edit / hide / mark sold-out, upload photos, set price and "bestseller / new" flags.
- **Orders:** list with filters; change status (pending → confirmed → making → shipped → delivered);
  add courier tracking; one-click "message customer on WhatsApp".
- **Custom & bulk enquiries**, **contact messages**, **reviews approval**, **newsletter list (CSV export)**.
- Simple sales summary (orders today / this month).
🧑 **You do:** log in and try it with test data; tell me what's confusing — I'll simplify.

✅ Result: you run the shop without touching code.

## STEP 6 — Razorpay online payments (Day 5–7)
🧑 **You do first (KYC takes a few days — start early!):**
1. razorpay.com → Sign up → complete **KYC** with PAN, bank account, business details/ID, website URL.
   (Ask Razorpay support exactly which documents your type of business needs.)
2. While KYC is pending, use **Test Mode**: Dashboard → Settings → API Keys → generate **Test** keys.
   - `Key ID` (starts `rzp_test_`) — safe in the website.
   - `Key Secret` — **secret**. Never put in website code or send in chat. Paste it only into
     Supabase → **Edge Functions → Secrets**.
🤖 **Claude builds:**
- A Supabase **Edge Function** `create-razorpay-order` (creates the payment using the server-verified total).
- A Supabase **Edge Function** `razorpay-webhook` that confirms payment from Razorpay's server and marks the
  order **paid** (so a customer can't fake "paid").
- Checkout option "Pay online (UPI / Cards / Netbanking)" alongside Cash on Delivery.
🧑 **You do:** deploy the functions (I'll give exact copy-paste commands), add the secrets, add the webhook
URL in Razorpay Dashboard → Webhooks, and test with Razorpay's test UPI/cards.
🧑 **Go live:** after KYC approval switch to **Live keys** (replace the secrets). Place one real ₹1–₹10 order
yourself and confirm it shows as paid in both Razorpay and your admin panel.

✅ Result: customers pay online; fee ≈ 2.36% per payment (2% + 18% GST); money in ~2 working days.

## STEP 7 — Order emails & shipping (optional but recommended)
🤖 Order-confirmation emails to the customer and an alert email to you (via a free-tier email service).
🧑 Create a free account at an email provider (e.g. Resend) and verify your domain. Pick a courier plan
   (Shiprocket, India Post, local courier) — compare per-parcel prices and COD charges.

## STEP 8 — Pre-launch checklist
- [ ] Real photos for every product (bright, plain background, 3–4 angles).
- [ ] Policies reviewed (shipping, returns, privacy). Ask an accountant/lawyer to glance at them.
- [ ] Ask your accountant about **GST registration** requirements for your turnover.
- [ ] Place test orders: COD, online payment, custom enquiry, bulk enquiry, contact form, newsletter.
- [ ] Test on 2 phones (Android + iPhone) and one laptop.
- [ ] Supabase on **Pro**, spend cap set, backups visible.
- [ ] Razorpay in **Live** mode, one real ₹1 payment tested.
- [ ] `robots.txt` + `sitemap.xml` live; site submitted to **Google Search Console**.
- [ ] Google Business Profile created (address: Chirgaon, Jhansi) — helps local search.
- [ ] Instagram bio link → your new domain. Add UTM tags (`?utm_source=instagram`) to track visits.

## STEP 9 — After launch (every week)
- Check orders/enquiries daily; reply on WhatsApp within hours.
- Approve reviews; add new products; update stock.
- Supabase → Database → Backups: confirm they run. Download a CSV of orders monthly.
- Rotate the admin password every few months. Never share it.

---

## Content to prepare (this is what makes the site sell)
1. **Product list** (spreadsheet): name, category, price, size/colour options, 2-line description, 3–4 photos each.
2. **Your story**: how you started + a photo of the village women at work (with their permission).
3. **Logo** in PNG with transparent background (your current JPEG has a white box).
4. Real **customer reviews / photos** (with permission) from Instagram.
5. Packaging photo + your delivery time promise (dispatch days, delivery days).

## Rough timeline
| Day | What |
|---|---|
| 1 | Steps 0–2 (schema, admin user, domain) |
| 2 | Step 3 (hosting, clean URLs, live on your domain — **soft launch**) |
| 3–6 | Steps 4–5 (products in DB, admin panel) |
| 5–7 | Step 6 (Razorpay — KYC time depends on Razorpay) |
| 8+ | Checklist, public launch, promotion |

You can go public after Step 3 using **COD + UPI via WhatsApp** — online payments can follow when Razorpay approves you.

---

## Step 4 — Products in the database + admin panel (Sakshi's page)

After this step the website reads products from Supabase, checkout totals are
calculated by the database (nobody can change a price in their browser), and
you and Sakshi manage everything at **https://sadasimpalbysakshi.in/admin**.

### 4a. Run the two SQL files (Supabase → SQL Editor → New query)
1. Paste `supabase/schema_v2.sql` → **Run**. (Safe to run twice.)
2. Paste `supabase/seed_products.sql` → **Run**. This loads your 13 current
   products and 7 categories. They start as "made to order" (always
   available) — change to real stock counts in the admin when you like.

### 4b. Turn OFF public sign-ups (important)
Supabase → **Authentication → Sign In / Providers → Email** (or "User Signups")
→ switch **"Allow new users to sign up" OFF** → Save.
Only people you create yourself can log in.

### 4c. Create the two admin logins
Supabase → **Authentication → Users → Add user → Create new user**
- Your email + a strong password (tick "Auto Confirm User")
- Sakshi's email + a strong password (tick "Auto Confirm User")

Then SQL Editor → run (use the two emails you just created):
```sql
insert into public.admins (user_id, email)
select id, email from auth.users
where email in ('YOUR-EMAIL-HERE', 'SAKSHI-EMAIL-HERE');
```
It should say "Success. 2 rows affected".

### 4d. Use it
Open `/admin`, sign in, and:
- **Products → Add new product**: name, category, photos, then one row per
  size/colour with its own price and stock. Click **Add to website** — it is
  live immediately.
- **Orders**: see every order, change status, add courier tracking, WhatsApp
  the customer. Choosing "Cancelled" puts the items back in stock.
- **Inbox**: custom/bulk requests, messages, review approvals, newsletter list.

### Notes
- Shipping rules (free above ₹999, else ₹60) live in two places that must match:
  `SITE.shipping` in `src/lib/site.ts` and the top of `place_order()` in
  `supabase/schema_v2.sql`.
- `public/sitemap.xml` is a static list. Products you add later appear on the
  site at once, but are only added to the sitemap if you regenerate it.
- If Supabase can't be reached, the site shows the built-in copy of the old 13
  products; ordering then falls back to "send your order on WhatsApp".
