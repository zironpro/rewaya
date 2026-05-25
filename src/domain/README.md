# Domain layer

Pure business types and mappers. **No Wix SDK imports** in this folder.

## What belongs here

| Layer | Responsibility | Examples |
|-------|----------------|----------|
| `domain/` | Canonical models, view-models, availability rules, map from adapter types | `Book`, `Bundle`, `ProductDetail`, `BundlePresentation` |
| `lib/wix/` | SDK clients, API calls, raw Wix shapes | `products.ts`, `bundles.ts`, `cart.ts` |
| `features/` | Route-specific UI, copy, layout variants | `product-detail-view`, `bundle-landing` sections |
| `components/` | Reusable UI (design system, commerce primitives) | `PurchasePanel`, `Button` |

## Import rules

- `domain` may import from `lib/catalog/types` during migration; target is self-contained `domain/catalog`.
- `lib/wix` may import `domain` mappers (one-way: Wix → domain).
- `features` and `app` import `domain` and `components`, not deep `lib/wix` except in server pages/loaders.

## File layout

```
domain/
  catalog/       # Book, Bundle, Faq
  product/       # availability, ProductDetail mapping
  bundle/        # BundlePresentation for marketing pages
```
