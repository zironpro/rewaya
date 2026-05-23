export interface DescriptionLine {
	name?: { translated?: string };
	plainText?: { translated?: string };
	colorInfo?: { translated?: string; code?: string };
}

export interface Availability {
	status?: string;
	quantityAvailable?: number;
}

export interface LineItem {
	_id?: string | null;
	productName?: { translated?: string };
	quantity?: number;
	price?: { amount?: string; formattedConvertedAmount?: string };
	fullPrice?: { formattedConvertedAmount?: string };
	lineItemPrice?: { amount?: string; formattedConvertedAmount?: string };
	image?: string;
	catalogReference?: { catalogItemId?: string };
	descriptionLines?: DescriptionLine[];
	availability?: Availability;
	url?: string | { relativePath?: string; url?: string };
}

export interface CartSummary {
	subtotal?: string;
	discount?: string;
	total?: string;
	discountNames: string[];
}

export const CART_CACHE_KEY = "cart:last-snapshot";

export type CartSnapshot = { lineItems: LineItem[]; summary: CartSummary };

export function formatDescriptionLine(line: DescriptionLine): string {
	const title = line.name?.translated;
	const value = line.plainText?.translated ?? line.colorInfo?.translated;
	if (title && value) return `${title}: ${value}`;
	return title ?? value ?? "";
}

/** First non-empty description line for subtitle (author, options, etc.) */
export function firstDescriptionSubtitle(item: LineItem): string {
	for (const line of item.descriptionLines ?? []) {
		const text = formatDescriptionLine(line);
		if (text) return text;
	}
	return "";
}

export function resolveCartImage(
	image: string | undefined,
	width = 200,
	height = 280
): string | undefined {
	if (!image) return undefined;
	if (image.startsWith("wix:image://")) {
		const match = image.match(/wix:image:\/\/v1\/([^/]+)/);
		if (match) {
			return `https://static.wixstatic.com/media/${match[1]}/v1/fill/w_${width},h_${height},al_c,q_80/${match[1]}`;
		}
	}
	return image;
}

export function isItemUnavailable(item: LineItem): boolean {
	const status = item.availability?.status;
	return status === "NOT_AVAILABLE" || status === "NOT_FOUND";
}

/** Rewaya product routes use `/product/<slug>`. */
export function resolveProductHref(item: LineItem): string | undefined {
	const url = item.url;
	if (!url) return undefined;
	const str = typeof url === "string" ? url : (url.relativePath ?? url.url);
	if (!str) return undefined;
	const match = str.match(/\/product-page\/([^/?#]+)/);
	return match ? `/product/${match[1]}` : undefined;
}

export function readCartSnapshot(): CartSnapshot | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.sessionStorage.getItem(CART_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed?.lineItems)) return null;
		return parsed as CartSnapshot;
	} catch {
		return null;
	}
}

export function writeCartSnapshot(snapshot: CartSnapshot): void {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(CART_CACHE_KEY, JSON.stringify(snapshot));
	} catch {
		/* storage full / denied */
	}
}

export function countLineItems(items: LineItem[]): number {
	return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

export function extractSummary(
	cart:
		| {
				priceSummary?: {
					subtotal?: { formattedConvertedAmount?: string };
					discount?: { formattedConvertedAmount?: string };
					total?: { formattedConvertedAmount?: string };
				};
				appliedDiscounts?: Array<{
					discountName?: string;
					coupon?: { name?: string };
					merchantDiscount?: { discountName?: string };
				}>;
				lineItems?: Array<{ lineItemPrice?: { amount?: string } }>;
				currency?: string;
		  }
		| undefined
): CartSummary {
	const ps = cart?.priceSummary;
	let subtotal = ps?.subtotal?.formattedConvertedAmount;
	const discount = ps?.discount?.formattedConvertedAmount;
	const total = ps?.total?.formattedConvertedAmount;

	if (!subtotal && cart?.lineItems?.length) {
		const sum = cart.lineItems.reduce((acc, item) => {
			const amt = item.lineItemPrice?.amount;
			return amt ? acc + Number(amt) : acc;
		}, 0);
		if (sum > 0) {
			try {
				subtotal = new Intl.NumberFormat(undefined, {
					style: "currency",
					currency: cart.currency ?? "AED",
				}).format(sum);
			} catch {
				subtotal = sum.toFixed(2);
			}
		}
	}

	const discountNames = (cart?.appliedDiscounts ?? [])
		.map(
			(d) =>
				d?.discountName || d?.coupon?.name || d?.merchantDiscount?.discountName
		)
		.filter((name): name is string => Boolean(name));

	return { subtotal, discount, total, discountNames };
}

/** Persist cart snapshot from any Wix cart API response. */
export function syncCartFromWixResponse(cart: unknown): CartSnapshot {
	const lineItems = ((cart as { lineItems?: LineItem[] })?.lineItems ??
		[]) as LineItem[];
	const summary = extractSummary(cart as Parameters<typeof extractSummary>[0]);
	const snapshot = { lineItems, summary };
	writeCartSnapshot(snapshot);
	return snapshot;
}
