import { handleWixApiRoute } from "@/lib/wix/api-routes";

type RouteContext = { params: Promise<{ path: string[] }> };

async function dispatch(request: Request, context: RouteContext) {
	const { path } = await context.params;
	return handleWixApiRoute(request, path ?? []);
}

export async function GET(request: Request, context: RouteContext) {
	return dispatch(request, context);
}

export async function POST(request: Request, context: RouteContext) {
	return dispatch(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
	return dispatch(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
	return dispatch(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
	return dispatch(request, context);
}
