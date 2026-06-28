# JerseyFootAcademy ⚽

> **Support Your Team. Wear The Passion.**

A premium, production-oriented e-commerce store for football jerseys — clubs &
national teams — with custom flocking, multi-currency, multi-language, Stripe
checkout and worldwide shipping from Thailand. Inspired by the 2026 World Cup.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Prisma · PostgreSQL · Stripe · NextAuth · next-intl**.

> ℹ️ This app lives in the `jerseyfootacademy/` subdirectory so it sits alongside
> the existing ISSANwebpower static site without disturbing it. On Vercel, set the
> **Root Directory** to `jerseyfootacademy`.

---

## ✨ Features

- **Storefront**: full-screen hero, best sellers, new arrivals, World Cup 2026
  collection, popular categories, newsletter, FAQ, partners.
- **Hierarchical catalog**: Continent → Country → City → Club, plus a National
  Teams branch. Fully data-driven and easily extensible (`src/data/`).
- **Product pages**: image gallery with hover-zoom, badges (New / Sale / World
  Cup / Best Seller), sizes XS–XXL with stock, description, size guide, reviews,
  and Schema.org structured data.
- **Jersey customizer**: name, number, font and flock color with a **live SVG
  preview** and automatic surcharge.
- **Demo reviews**: realistic seed reviews across many products, clearly flagged
  `isDemo` so they can be purged before launch.
- **Smart search & filters**: by club, country, city, competition, player, year;
  sort by price/rating/popularity.
- **Cart**: quantity controls, promo codes, live shipping estimate, totals.
- **Checkout**: Stripe Checkout (Visa, Mastercard, Apple Pay, Google Pay).
  Prices are **always recomputed server-side** — never trusted from the client.
- **Shipping**: zone-based international rates modelled on Thailand Post, with
  standard/express options and ETAs — all in one editable config file.
- **Accounts**: register, login, forgot-password, order history (NextAuth).
- **Admin dashboard**: KPIs, orders, products table, CSV export, scaffolded
  customers/promos/stats/settings.
- **i18n**: French, English, Italian, German, Spanish, Dutch. **6 currencies**:
  USD, EUR, THB, GBP, AUD, CAD.
- **SEO**: per-page metadata, Open Graph (auto-generated image), Twitter cards,
  `sitemap.xml`, `robots.txt`, JSON-LD, web manifest.
- **Security**: security headers, rate limiting on auth/checkout, admin route
  protection, Zod validation, bcrypt password hashing, input sanitisation.

---

## 🚀 Quick start

```bash
cd jerseyfootacademy
cp .env.example .env          # fill in the values (see below)
npm install
npm run prisma:push          # create the database schema (needs DATABASE_URL)
npm run db:seed              # load catalog + demo reviews + admin user
npm run dev                  # http://localhost:3000
```

> **No database yet?** The storefront still runs fully (browsing, cart,
> customizer) because catalog data is bundled in `src/data/`. The database powers
> orders, accounts, admin and persisted reviews.

Default admin after seeding: `admin@jerseyfootacademy.com` / `changeme123`
**(change this immediately).**

---

## 🔑 Environment variables

See [`.env.example`](./.env.example) for the full list. Summary:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` / `DIRECT_URL` | for DB features | PostgreSQL connection |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | for auth | NextAuth session signing |
| `GOOGLE_CLIENT_ID/SECRET` | optional | Google OAuth login |
| `STRIPE_SECRET_KEY` | for checkout | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | for checkout | Stripe client key |
| `STRIPE_WEBHOOK_SECRET` | for order sync | Stripe webhook verification |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for SEO/redirects |

---

## 🧱 Project structure

```
jerseyfootacademy/
├─ prisma/
│  ├─ schema.prisma        # data model (catalog, orders, users, promos…)
│  └─ seed.ts              # seeds DB from src/data/*
├─ messages/               # i18n catalogs (fr, en, it, de, es, nl)
├─ src/
│  ├─ app/                 # routes (storefront, cart, checkout, account, admin, api)
│  ├─ components/          # UI, layout, product, home, admin
│  ├─ config/              # site, currencies, shipping, customization, promos, countries
│  ├─ data/                # canonical catalog: categories, products, reviews, queries
│  ├─ i18n/                # next-intl request config
│  └─ lib/                 # prisma, stripe, auth, cart store, utils
└─ public/                 # logo, icon (favicon), brand assets
```

### Extending the catalog

Everything is data-driven. To add clubs/products, edit `src/data/categories.ts`
and `src/data/products.ts` (slugs must be unique), then re-run `npm run db:seed`.
Shipping tariffs live in `src/config/shipping.ts`; currencies in
`src/config/currencies.ts`.

---

## 💳 Stripe webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_… into STRIPE_WEBHOOK_SECRET
```

---

## ☁️ Deploy to Vercel

1. Import the repo on Vercel; set **Root Directory = `jerseyfootacademy`**.
2. Add a PostgreSQL database (Vercel Postgres / Neon / Supabase) and set
   `DATABASE_URL` + `DIRECT_URL`.
3. Add all environment variables from `.env.example`.
4. Deploy. Build runs `prisma generate && next build`.
5. After first deploy: run `prisma migrate deploy` (or `prisma db push`) and
   `npm run db:seed` against the production DB, and add the Stripe webhook
   endpoint pointing at `/api/webhooks/stripe`.

---

## ⚠️ Before going to production

- [ ] Delete demo reviews: `prisma.review.deleteMany({ where: { isDemo: true } })`
- [ ] Change the seeded admin password.
- [ ] Replace placeholder copy in About/Privacy/Terms and the FAQ.
- [ ] Update shipping rates with the official Thailand Post tariff.
- [ ] Refresh currency rates from a live feed.
- [ ] Replace Unsplash placeholder images with real product photography.
- [ ] Verify your domain with Apple Pay in the Stripe dashboard.

---

## 🛠️ Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run typecheck` | TypeScript check |
| `npm run prisma:push` | Push schema to the database |
| `npm run db:seed` | Seed catalog + demo data |
| `npm run prisma:studio` | Open Prisma Studio |
