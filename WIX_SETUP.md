# Wix Headless Setup — Rewaya Books

This Next.js storefront connects to **AL REWAYA BOOKSTORE** on Wix Studio (`siteId` in `wix.config.json`).

## 1. Authenticate

```bash
npx @wix/cli login
```

Complete the browser step when prompted.

## 2. Pull OAuth client ID

```bash
npx @wix/cli env pull
```

Copy values into `.env.local`:

```env
WIX_CLIENT_ID=<from env pull>
NEXT_PUBLIC_WIX_CLIENT_ID=<same value>
NEXT_PUBLIC_WIX_SITE_ID=835db726-cfca-4ef4-8305-4002f5f62aef
USE_WIX_CATALOG=true
```

## 3. Install dependencies

```bash
npm install --legacy-peer-deps
```

## 4. Run the app

```bash
npm run dev
```

- `/shop` — live Wix catalog (Catalog **V1** on this site)
- `/bundles` — CMS `BundleDetails` joined with Stores bundle products (falls back to static data until seeded)
- `/cart` — Wix eCommerce cart + checkout redirect

## Optional: Admin API key

For bulk bundle seeding (`scripts/seed-wix-bundles.mjs`):

1. Create a key at [Wix API Keys](https://manage.wix.com/account/api-keys)
2. Add to `.env.local`: `WIX_API_KEY=...` (never commit)
3. Run: `node scripts/seed-wix-bundles.mjs`

Then in Wix CMS → **Bundle Details**, set `includedBookIds` for each row to a JSON array of Stores product IDs.

## Catalog version note

This site uses **Stores Catalog V1**. The code auto-detects version via `catalogVersioning.getCatalogVersion()` and uses `products` (V1) or `productsV3` (V3) accordingly.

## Dashboard

[https://manage.wix.com/dashboard/835db726-cfca-4ef4-8305-4002f5f62aef](https://manage.wix.com/dashboard/835db726-cfca-4ef4-8305-4002f5f62aef)
