import "server-only";

/** Enable with CHECKOUT_DEBUG=1 (server) or NEXT_PUBLIC_CHECKOUT_DEBUG=1 (client UI). */
export function isCheckoutDebugEnabled(): boolean {
	return (
		process.env.CHECKOUT_DEBUG === "1" ||
		process.env.NEXT_PUBLIC_CHECKOUT_DEBUG === "1"
	);
}

export function isCheckoutDebugClientVisible(): boolean {
	return process.env.NEXT_PUBLIC_CHECKOUT_DEBUG === "1";
}

export type CheckoutDebugStep =
	| "resolve-origin"
	| "add-bundle"
	| "create-checkout"
	| "redirect-session"
	| "complete";

export interface CheckoutDebugPayload {
	step: CheckoutDebugStep;
	origin: string;
	bundleSlug?: string;
	catalogItemId?: string;
	catalogAppId?: string;
	lineItemCount?: number;
	checkoutId?: string;
	checkoutUrl?: string;
	channelType?: string;
	error?: ReturnType<typeof serializeWixError>;
}

export function serializeWixError(error: unknown): {
	message?: string;
	code?: string;
	description?: string;
} {
	if (!error || typeof error !== "object") {
		return { message: String(error) };
	}
	const err = error as {
		message?: string;
		details?: { applicationError?: { code?: string; description?: string } };
	};
	return {
		message: err.message,
		code: err.details?.applicationError?.code,
		description: err.details?.applicationError?.description,
	};
}

export function checkoutDebug(
	label: string,
	payload: Record<string, unknown>
): void {
	if (!isCheckoutDebugEnabled()) return;
	console.info(`[checkout:debug] ${label}`, payload);
}
