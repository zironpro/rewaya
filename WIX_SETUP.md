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

- `/shop` — Wix Stores catalog (V1 or V3 auto-detected)
- `/` — homepage sections from CMS `HomepageSections` (category slugs) or category fallbacks
- `/bundles` — CMS `Bundles` collection + Stores bundle products
- `/cart` — Wix eCommerce cart + checkout redirect
- `/thank-you` — post-checkout confirmation (`?orderId=`)
- `/product/[slug]` — on-demand ISR (not pre-built at deploy; large catalogs exceed build timeouts)

## OAuth app (required for cart & checkout)

[OAuth apps settings](https://manage.wix.com/dashboard/835db726-cfca-4ef4-8305-4002f5f62aef/oauth-apps-settings):

1. **Allowed redirect domains** — `http://localhost:3000` and production hostname
2. **Authorization redirect URIs** — `/auth/callback` on each origin
3. **Post-checkout / thank-you** — allow `/thank-you` on your headless domain
4. **Password reset redirect** — `/login` on each origin

Visitor cart uses the `wix_session` cookie (set by middleware). Add-to-cart sends `catalogItemId` plus variant/options per [Wix headless-templates commerce](https://github.com/wix/headless-templates/blob/main/nextjs/commerce/lib/wix/index.ts).

## Catalog version

Auto-detected via `catalogVersioning.getCatalogVersion()`:

- **V1** — `options: { options: { OptionName: value } }` for simple products (placeholder variant id)
- **V3** — `options: { variantId }` on add-to-cart

## CMS collections

### `HomepageSections` (category-driven, no product ID lists)

| Field | Type | Notes |
|-------|------|-------|
| `sectionKey` | Text | e.g. `recommended`, `todays-deals`, `new-sellers`, `best-sellers`, `children` |
| `title`, `subtitle` | Text | Optional UI overrides |
| `categorySlug` | Text | **Required** — Wix Stores category slug |
| `limit` | Number | Default 12 |
| `badge` | Text | `best seller`, `new seller`, `new arrival` |
| `sortOrder` | Number | Section order |
| `enabled` | Boolean | |

Use your **existing** Wix category names/slugs (no need to create `recommended` or `deals`). Default homepage sections map by name:

| `sectionKey` | Wix category (name) | Products (approx.) |
|--------------|---------------------|--------------------|
| `recommended` | Islamic, else Fiction | 852 / 466 |
| `todays-deals` | Today's Deals | 248 |
| `new-sellers` | Teen Fiction, else Young Adults / Comics | 62 / 11 / 20 |
| `best-sellers` | Best Sellers (largest duplicate if two exist) | 151 |
| `children` | Children Books | 3009 |

In CMS `HomepageSections`, set `categorySlug` to the **slug from Wix** (Dashboard → category → URL), e.g. `children-books`, `todays-deals`, `best-sellers`. Aliases like `children` and `deals` still resolve via name.

**Your store categories** (for reference): All Products, Best Sellers, 3+, 5+, Adult, Arabic, Biography, Business, Children Books, Comics, Dictionary, Education, Fiction, Islamic, Non Fiction, Non-Fiction, Poetry, PREGNANCY & CHILDCARE, Psychology, Reference, Self Help, Teen Fiction, Today's Deals, Young Adults.

### `HomeBanners` (hero carousel)

| Field | Type |
|-------|------|
| `title`, `subtitle`, `ctaLabel`, `ctaHref` | Text |
| `image` | URL or media |
| `sortOrder`, `enabled` | Number / Boolean |

### `BookBundles` (CMS ID; dashboard label: **Bundles**)

Each row is a marketing/content bundle. Checkout uses a **separate Wix Stores product** per bundle (discounted bundle SKU).

| Field | Type | Notes |
|-------|------|-------|
| `bundleTitle` | Text | Display name; slug generated for URLs |
| `bundleProductId` | Text | **Required for checkout** — Wix Stores product ID for this bundle |
| `bundleProducts` | Multi-reference | Included Wix Stores books — **display only** (“what’s inside”) |
| `price` | Number | Bundle price (AED) for UI; should match the Stores bundle product price |
| `originalPrice` | Number | Strikethrough / savings |
| `overview` | Text | Description |
| `bundleImage` | Image | Cover art |
| `offerStart` / `offerEnd` | Date | Optional campaign window |
| `quantityAvailable` | Number | Optional stock hint |

**Dashboard setup (per bundle):**

1. Create a Wix Stores product with the bundle discounted price and name.
2. Copy the product ID into `bundleProductId` on the matching `BookBundles` row.
3. Link books in `bundleProducts` for the “what’s inside” list only.

**Add to cart:** one line only. If `bundleProductId` is set → Wix Stores app + that product id. If not set yet → CMS catalog app (`e593b0bd-b783-45b8-97c2-873d42aacaf4`) + the BookBundles row `_id` (bundle CMS price). Do not add individual `bundleProducts` IDs to the cart.

## Purchase flow

1. Product page loads catalog once (slug query + variants)
2. **Add to cart** — `currentCart.addToCurrentCart` with `catalogReference`
3. **Cart** — `getCurrentCart`, update/remove line items
4. **Checkout** — `createCheckoutFromCurrentCart` (`OTHER_PLATFORM`, fallback `WEB`) → `createRedirectSession` with `thankYouPageUrl`, `cartPageUrl`, `postFlowUrl`
5. **Thank you** — `/thank-you?orderId=`

Connect a payment provider in the Wix dashboard before live checkout.

## Authentication

Member routes: `/login`, `/signup`, `/auth/callback`, `/profile/*`.

Enable OAuth permissions: Read Orders, Read/Manage Members.

## Dashboard

[https://manage.wix.com/dashboard/835db726-cfca-4ef4-8305-4002f5f62aef](https://manage.wix.com/dashboard/835db726-cfca-4ef4-8305-4002f5f62aef)
