import { cookies } from "next/headers";

import { orders } from "@wix/ecom";
import { members } from "@wix/members";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";

export const wixClientServer = async () => {
	let refreshToken;

	try {
		const cookieStore = await cookies();
		refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");
	} catch (e) {
		console.error(e);
	}

	const wixClient = createClient({
		modules: {
			products,
			collections,
			orders,
			members,
		},
		auth: OAuthStrategy({
			clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
			tokens: {
				refreshToken,
				accessToken: { value: "", expiresAt: 0 },
			},
		}),
	});

	return wixClient;
};
