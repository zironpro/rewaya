import { GraphQLClient, RequestDocument } from "graphql-request";

const graphqlEndpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL || "";

const graphqlAdminEndpoint = process.env.SHOPIFY_ADMIN_API_URL || "";

const client = new GraphQLClient(graphqlEndpoint, {
	headers: {
		"X-Shopify-Storefront-Access-Token":
			process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
	},
});

const server = new GraphQLClient(graphqlAdminEndpoint, {
	headers: {
		"X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
	},
});

// biome-ignore lint/suspicious/noExplicitAny: Expect anything
export const fetchGraphQL = async <T = any>(
	query: RequestDocument,
	// biome-ignore lint/suspicious/noExplicitAny: Expect anything
	variables?: Record<string, any>
): Promise<T> => {
	try {
		// graphql-request handles both string and gql template literal queries
		return await client.request<T>(query, variables);
	} catch (error) {
		console.error("GraphQL Request Error:", error);
		throw error;
	}
};

// biome-ignore lint/suspicious/noExplicitAny: Expect anything
export const fetchAdminGraphQL = async <T = any>(
	query: RequestDocument,
	// biome-ignore lint/suspicious/noExplicitAny: Expect anything
	variables?: Record<string, any>
): Promise<T> => {
	// Surface a clear error when admin endpoint or token are missing
	if (!graphqlAdminEndpoint || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
		console.error(
			"Missing SHOPIFY_ADMIN_API_URL or SHOPIFY_ADMIN_ACCESS_TOKEN environment variables."
		);
		throw new Error(
			"Missing SHOPIFY_ADMIN_API_URL or SHOPIFY_ADMIN_ACCESS_TOKEN. Ensure you set these in .env.local and restart the dev server. Also confirm the Admin app has the required product scopes (read_products or write_products)."
		);
	}
	try {
		// graphql-request handles both string and gql template literal queries
		return await server.request<T>(query, variables);
	} catch (error) {
		console.error("GraphQL Request Error:", error);
		throw error;
	}
};
