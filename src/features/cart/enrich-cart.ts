import type { LineItem } from "@/features/cart/cart-sdk";
import type { Bundle } from "@/lib/catalog/types";
import { buildBundleCatalogLookup } from "@/lib/wix/bundles";

function lookupBundleForLine(
	lookup: ReturnType<typeof buildBundleCatalogLookup>,
	item: LineItem
) {
	const catalogItemId = item.catalogReference?.catalogItemId?.trim();
	if (!catalogItemId) return undefined;
	return lookup.get(catalogItemId);
}

/** Attach bundle slug, label, href, and cover for cart line items. */
export function enrichCartWithBundles(
	cart: unknown,
	bundles: Bundle[]
): unknown {
	if (!cart || typeof cart !== "object" || bundles.length === 0) {
		return cart;
	}

	const lookup = buildBundleCatalogLookup(bundles);
	const raw = cart as { lineItems?: LineItem[] };
	if (!Array.isArray(raw.lineItems) || raw.lineItems.length === 0) {
		return cart;
	}

	const lineItems = raw.lineItems.map((item) => {
		const bundle = lookupBundleForLine(lookup, item);
		if (!bundle) return item;

		return {
			...item,
			isBundle: true,
			bundleSlug: bundle.slug,
			href: `/bundles/${bundle.slug}`,
			image: item.image ?? bundle.coverImage,
			productName: item.productName?.translated
				? item.productName
				: { translated: bundle.title },
		};
	});

	return { ...raw, lineItems };
}
