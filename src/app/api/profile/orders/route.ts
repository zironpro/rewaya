import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { orders } from "@wix/ecom";
import { members } from "@wix/members";
import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";

import { WIX_SESSION_COOKIE, WIX_SITE_ID } from "@/lib/wix/constants";
import { asOrdersClient, fetchMemberOrders } from "@/lib/wix/profile-actions";

function parseTokens(raw: string | undefined): Tokens | null {
	if (!raw) return null;
	try {
		return JSON.parse(decodeURIComponent(raw)) as Tokens;
	} catch {
		try {
			return JSON.parse(raw) as Tokens;
		} catch {
			return null;
		}
	}
}

export async function GET() {
	const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
	if (!clientId) {
		return NextResponse.json({ orders: [] });
	}

	const cookieStore = await cookies();
	const tokens = parseTokens(cookieStore.get(WIX_SESSION_COOKIE)?.value);
	if (!tokens) {
		return NextResponse.json({ orders: [] }, { status: 401 });
	}

	const client = createClient({
		modules: { orders, members },
		auth: OAuthStrategy({ clientId, tokens }),
		headers: { "wix-site-id": WIX_SITE_ID },
	});

	if (!client.auth.loggedIn()) {
		return NextResponse.json({ orders: [] }, { status: 401 });
	}

	try {
		const { member } = await client.members.getCurrentMember();
		const memberId = member?._id;
		if (!memberId) {
			return NextResponse.json({ orders: [] });
		}

		const list = await fetchMemberOrders(asOrdersClient(client), memberId);
		return NextResponse.json({ orders: list });
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch orders" },
			{ status: 500 }
		);
	}
}
