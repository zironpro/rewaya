import "server-only";

import { getWixClient } from "./client";

export async function wixFetch<T>(
	url: string,
	body: Record<string, unknown>
): Promise<T> {
	const client = getWixClient();
	const response = await client.fetchWithAuth(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Wix API failed (${response.status}): ${text}`);
	}

	return response.json() as Promise<T>;
}
