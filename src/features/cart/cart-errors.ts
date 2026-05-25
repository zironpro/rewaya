export function getWixApplicationErrorCode(error: unknown): string | undefined {
	return (error as { details?: { applicationError?: { code?: string } } })
		?.details?.applicationError?.code;
}

export function messageForAddBundleError(error: unknown): string {
	const code = getWixApplicationErrorCode(error);
	if (
		code === "NOT_FOUND" ||
		code === "CATALOG_ITEM_NOT_FOUND" ||
		code === "INVALID_CATALOG_ITEM"
	) {
		return "This bundle is not available for purchase. Check that bundleProductId is set on the BookBundles row in Wix.";
	}
	if (code === "OWNED_CART_NOT_FOUND") {
		return "Your cart session expired. Refresh the page and try again.";
	}
	return "Could not add bundle to cart. Please try again.";
}
