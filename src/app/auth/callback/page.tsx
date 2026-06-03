import { consumeOAuthDataCookie } from "@/lib/wix/api-routes";

import { AuthCallbackClient } from "./auth-callback-client";

export default async function AuthCallbackPage() {
	const oauthDataFromServer = await consumeOAuthDataCookie();
	return <AuthCallbackClient oauthDataFromServer={oauthDataFromServer} />;
}
