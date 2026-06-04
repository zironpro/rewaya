import "server-only";

import { headers } from "next/headers";

/** Resolve the public site origin for Wix redirect callback URLs. */
export async function resolveCheckoutOrigin(
	originOverride?: string
): Promise<string> {
	const override = originOverride?.trim();
	if (override) return override.replace(/\/$/, "");

	const headersList = await headers();
	const referer = headersList.get("referer");
	const forwardedHost = headersList.get("x-forwarded-host");
	const forwardedProto = headersList.get("x-forwarded-proto");
	const host = headersList.get("host");
	const originHeader = headersList.get("origin");

	const deploymentOrigin = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: undefined;
	const fallbackOrigin =
		process.env.NEXT_PUBLIC_SITE_URL ??
		deploymentOrigin ??
		"http://localhost:3000";

	const refererOrigin = referer ? new URL(referer).origin : undefined;
	const headerOrigin =
		forwardedHost && forwardedProto
			? `${forwardedProto}://${forwardedHost}`
			: host
				? `${host.includes("localhost") ? "http" : "https"}://${host}`
				: undefined;

	return (
		originHeader ??
		headerOrigin ??
		refererOrigin ??
		fallbackOrigin
	).replace(/\/$/, "");
}
