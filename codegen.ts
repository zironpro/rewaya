import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	generates: {
		"./src/types/shopify-storefront-graphql.ts": {
			schema: {
				[`${process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL}`]: {
					headers: {
						"X-Shopify-Storefront-Access-Token":
							process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
						"Content-Type": "application/json",
					},
				},
			},
			documents: [
				"src/qraphql/storefront/**/*.{ts,tsx,graphql,gql}",
				"src/**/*.{graphql,gql}",
			],
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-query",
			],
		},

		"./src/types/shopify-admin-graphql.ts": {
			schema: {
				[`${process.env.SHOPIFY_ADMIN_API_URL}`]: {
					headers: {
						"X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
						"Content-Type": "application/json",
					},
				},
			},
			documents: [
				"src/qraphql/admin/**/*.{ts,tsx,graphql,gql}",
				"src/**/*.{graphql,gql}",
			],
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-query",
			],
		},
	},
};

export default config;
