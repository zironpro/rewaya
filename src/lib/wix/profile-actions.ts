import type { WixMember } from "./auth-actions";

/** Wix client with orders module (browser or API route). */
export type WixOrdersClient = {
	orders: {
		searchOrders: (
			search: Record<string, unknown>
		) => Promise<{ orders?: unknown[] }>;
	};
};

export function asOrdersClient(client: unknown): WixOrdersClient {
	return client as WixOrdersClient;
}

export type ProfileOrder = {
	id: string;
	orderId: string;
	date: string;
	status: string;
	total: string;
	items: number;
	trackingUrl?: string;
	trackingNumber?: string;
};

export type ProfileAddress = {
	id: string;
	type: string;
	name: string;
	street: string;
	city: string;
	country: string;
	phone: string;
	isDefault: boolean;
};

export type ProfilePaymentMethod = {
	id: string;
	type: string;
	provider: string;
	last4: string;
	expiry: string;
	isDefault: boolean;
};

type WixAddress = {
	id?: string;
	addressLine?: string;
	addressLine2?: string;
	streetAddress?: { number?: string; name?: string };
	city?: string;
	country?: string;
	postalCode?: string;
};

type WixOrderRaw = {
	_id?: string;
	id?: string;
	number?: string;
	createdDate?: Date | string;
	purchasedDate?: Date | string;
	status?: string;
	fulfillmentStatus?: string;
	lineItems?: unknown[];
	shippingInfo?: {
		deliveries?: Array<{
			trackingInfo?: {
				trackingLink?: string;
				trackingNumber?: string;
				shippingProvider?: string;
			};
		}>;
	};
	fulfillments?: Array<{
		trackingInfo?: {
			trackingLink?: string;
			trackingNumber?: string;
			shippingProvider?: string;
		};
	}>;
	priceSummary?: {
		total?: { formattedAmount?: string; amount?: string };
	};
	payment?: {
		creditCardLastDigits?: string;
		paymentMethod?: string;
	};
	transactions?: Array<{
		paymentDetails?: {
			creditCardDetails?: { lastFourDigits?: string; brand?: string };
			paymentMethodName?: string;
		};
	}>;
};

function formatOrderDate(value: Date | string | undefined): string {
	if (!value) return "—";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatOrderStatus(order: WixOrderRaw): string {
	const fulfillment = order.fulfillmentStatus;
	if (fulfillment === "FULFILLED") return "Delivered";
	if (fulfillment === "PARTIALLY_FULFILLED") return "Partially shipped";
	if (order.status === "CANCELED") return "Cancelled";
	if (fulfillment === "NOT_FULFILLED" && order.status === "APPROVED") {
		return "Processing";
	}
	if (order.status === "APPROVED") return "Confirmed";
	return order.status?.replace(/_/g, " ") ?? "Processing";
}

function mapOrder(order: WixOrderRaw): ProfileOrder {
	const orderId = order._id ?? order.id ?? "";
	const displayNumber = order.number ? `#${order.number}` : orderId.slice(0, 8);
	const total =
		order.priceSummary?.total?.formattedAmount ??
		(order.priceSummary?.total?.amount
			? `$${order.priceSummary.total.amount}`
			: "—");

	const delivery =
		order.shippingInfo?.deliveries?.[0] ?? order.fulfillments?.[0];
	const trackingLink = delivery?.trackingInfo?.trackingLink;
	const trackingNumber = delivery?.trackingInfo?.trackingNumber;

	return {
		id: displayNumber,
		orderId,
		date: formatOrderDate(order.purchasedDate ?? order.createdDate),
		status: formatOrderStatus(order),
		total,
		items: Array.isArray(order.lineItems) ? order.lineItems.length : 0,
		trackingUrl: trackingLink,
		trackingNumber,
	};
}

export async function fetchMemberOrders(
	client: WixOrdersClient,
	memberId: string
): Promise<ProfileOrder[]> {
	try {
		const result = await client.orders.searchOrders({
			filter: { "buyerInfo.memberId": memberId },
			sort: [{ fieldName: "createdDate", order: "DESC" }],
			cursorPaging: { limit: 50 },
		});

		return (result.orders ?? []).map((o) => mapOrder(o as WixOrderRaw));
	} catch {
		return [];
	}
}

function formatStreet(address: WixAddress): string {
	if (address.addressLine) {
		return [address.addressLine, address.addressLine2]
			.filter(Boolean)
			.join(", ");
	}
	const street = address.streetAddress;
	if (street?.number || street?.name) {
		return [street.number, street.name, address.addressLine2]
			.filter(Boolean)
			.join(" ");
	}
	return address.addressLine2 ?? "—";
}

export function mapWixAddresses(member: WixMember | null): ProfileAddress[] {
	const addresses = member?.contact?.addresses ?? [];
	const contactName = [
		member?.contact?.firstName ?? member?.profile?.firstName,
		member?.contact?.lastName ?? member?.profile?.lastName,
	]
		.filter(Boolean)
		.join(" ");

	const phone =
		member?.contact?.phones?.[0]?.phone ??
		member?.contact?.phones?.[0]?.formattedPhone ??
		"";

	return addresses.map((addr, index) => {
		const a = addr as WixAddress;
		return {
			id: a.id ?? `addr-${index}`,
			type: index === 0 ? "Primary" : `Address ${index + 1}`,
			name: contactName || "—",
			street: formatStreet(a),
			city: a.city ?? "—",
			country: a.country ?? "—",
			phone,
			isDefault: index === 0,
		};
	});
}

function cardBrandFromName(name?: string): string {
	if (!name) return "Card";
	const n = name.toLowerCase();
	if (n.includes("visa")) return "Visa";
	if (n.includes("master")) return "Mastercard";
	if (n.includes("amex")) return "Amex";
	return name;
}

export function extractPaymentMethodsFromOrders(
	_rawOrders: ProfileOrder[],
	rawOrders?: WixOrderRaw[]
): ProfilePaymentMethod[] {
	const seen = new Set<string>();
	const methods: ProfilePaymentMethod[] = [];

	const sources = rawOrders ?? [];
	for (const order of sources) {
		const tx = order.transactions ?? [];
		for (const t of tx) {
			const card = t.paymentDetails?.creditCardDetails;
			const last4 = card?.lastFourDigits ?? order.payment?.creditCardLastDigits;
			if (!last4) continue;

			const key = `${card?.brand ?? ""}-${last4}`;
			if (seen.has(key)) continue;
			seen.add(key);

			const provider = cardBrandFromName(
				card?.brand ?? t.paymentDetails?.paymentMethodName
			);
			methods.push({
				id: key,
				type: provider,
				provider,
				last4,
				expiry: "—",
				isDefault: methods.length === 0,
			});
		}

		if (order.payment?.creditCardLastDigits) {
			const last4 = order.payment.creditCardLastDigits;
			const key = `card-${last4}`;
			if (!seen.has(key)) {
				seen.add(key);
				methods.push({
					id: key,
					type: "Card",
					provider: cardBrandFromName(order.payment.paymentMethod),
					last4,
					expiry: "—",
					isDefault: methods.length === 0,
				});
			}
		}
	}

	return methods;
}

export async function fetchMemberOrdersRaw(
	client: WixOrdersClient,
	memberId: string
): Promise<WixOrderRaw[]> {
	try {
		const result = await client.orders.searchOrders({
			filter: { "buyerInfo.memberId": memberId },
			sort: [{ fieldName: "createdDate", order: "DESC" }],
			cursorPaging: { limit: 50 },
		});
		return (result.orders ?? []) as WixOrderRaw[];
	} catch {
		return [];
	}
}

export type MemberProfilePatch = {
	firstName?: string;
	lastName?: string;
	nickname?: string;
	phone?: string;
};

export async function updateMemberProfile(
	client: unknown,
	member: WixMember,
	patch: MemberProfilePatch
): Promise<WixMember | null> {
	const membersApi = (
		client as { members: { updateMember: (p: unknown) => Promise<unknown> } }
	).members;
	if (!member._id) return null;

	const phones = patch.phone
		? [{ phone: patch.phone, primary: true }]
		: member.contact?.phones;

	try {
		const result = (await membersApi.updateMember({
			member: {
				id: member._id,
				contact: {
					firstName: patch.firstName ?? member.contact?.firstName,
					lastName: patch.lastName ?? member.contact?.lastName,
					phones,
					addresses: member.contact?.addresses,
				},
				profile: {
					nickname: patch.nickname ?? member.profile?.nickname,
					firstName: patch.firstName ?? member.profile?.firstName,
					lastName: patch.lastName ?? member.profile?.lastName,
				},
			},
		})) as { member?: WixMember };
		return result.member ?? null;
	} catch {
		return null;
	}
}

export function memberPhone(member: WixMember | null): string {
	const phone = member?.contact?.phones?.[0];
	return phone?.formattedPhone ?? phone?.phone ?? "—";
}
