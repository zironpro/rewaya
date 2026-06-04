import { NextResponse } from "next/server";

import { handleWixApiRoute } from "@/lib/wix/api-routes";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	try {
		const { path } = await params;
		const res = await handleWixApiRoute(request, path ?? []);
		return res;
	} catch (err) {
		return NextResponse.json(
			{ ok: false, error: err instanceof Error ? err.message : "" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	try {
		const { path } = await params;
		const res = await handleWixApiRoute(request, path ?? []);
		return res;
	} catch (err) {
		return NextResponse.json(
			{ ok: false, error: err instanceof Error ? err.message : "" },
			{ status: 500 }
		);
	}
}
