import { readFileSync, existsSync } from "fs";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";

for (const file of [".env.local", ".env"]) {
	if (!existsSync(file)) continue;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const m = line.match(/^([^#=]+)=(.*)$/);
		if (m && !process.env[m[1].trim()])
			process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
	}
}

const client = createClient({
	modules: { items },
	auth: OAuthStrategy({ clientId: process.env.WIX_CLIENT_ID }),
	headers: { "wix-site-id": process.env.NEXT_PUBLIC_WIX_SITE_ID },
});

const { items: rows } = await client.items.query("BookBundles").limit(10).find();
console.log("BookBundles count:", rows.length);
for (const item of rows) {
	console.log({
		_id: item._id,
		keys: Object.keys(item.data ?? {}),
		bundleTitle: item.data?.bundleTitle,
		bundleProducts: item.data?.bundleProducts,
		price: item.data?.price,
	});
}
