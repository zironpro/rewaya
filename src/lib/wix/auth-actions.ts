import { members } from "@wix/members";
import type { StateMachine, Tokens } from "@wix/sdk";

import type { WixBrowserClient } from "./browser-client";

type WixClient = NonNullable<WixBrowserClient>;

type MemberProfile = {
	firstName?: string;
	lastName?: string;
};

export type WixMember = {
	_id?: string;
	loginEmail?: string;
	profile?: {
		nickname?: string;
		slug?: string;
		firstName?: string;
		lastName?: string;
		photo?: { url?: string };
	};
	contact?: {
		firstName?: string;
		lastName?: string;
		phones?: Array<{
			phone?: string;
			formattedPhone?: string;
			primary?: boolean;
		}>;
		emails?: Array<{
			email?: string;
			primary?: boolean;
		}>;
		addresses?: Array<{
			id?: string;
			addressLine?: string;
			addressLine2?: string;
			streetAddress?: { number?: string; name?: string };
			city?: string;
			country?: string;
			postalCode?: string;
		}>;
	};
};

export type AuthFlowResult =
	| { status: "success" }
	| { status: "verification"; state: StateMachine }
	| { status: "owner_approval" }
	| { status: "error"; message: string };

export function getAuthErrorMessage(
	errorCode?: string,
	fallback?: string
): string {
	switch (errorCode) {
		case "invalidEmail":
			return "Please enter a valid email address.";
		case "invalidPassword":
			return "Please check your password and try again.";
		case "emailAlreadyExists":
			return "An account with this email already exists. Try logging in.";
		case "resetPassword":
			return "You need to reset your password. Check your email.";
		default:
			return fallback ?? "Something went wrong. Please try again.";
	}
}

export function splitFullName(fullName: string): {
	firstName: string;
	lastName?: string;
} {
	const parts = fullName.trim().split(/\s+/).filter(Boolean);
	const firstName = parts[0] ?? "";
	const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
	return { firstName, lastName };
}

export async function applyMemberTokens(
	client: WixClient,
	sessionToken: string
): Promise<Tokens> {
	const tokens = await client.auth.getMemberTokensForDirectLogin(sessionToken);
	client.auth.setTokens(tokens);
	return tokens;
}

export async function handleAuthStateMachine(
	client: WixClient,
	response: StateMachine
): Promise<AuthFlowResult> {
	if (response.loginState === "SUCCESS" && "data" in response) {
		await applyMemberTokens(client, response.data.sessionToken);
		return { status: "success" };
	}

	if (response.loginState === "EMAIL_VERIFICATION_REQUIRED") {
		return { status: "verification", state: response };
	}

	if (response.loginState === "OWNER_APPROVAL_REQUIRED") {
		return {
			status: "owner_approval",
		};
	}

	if (response.loginState === "FAILURE" && "errorCode" in response) {
		return {
			status: "error",
			message: getAuthErrorMessage(response.errorCode, response.error),
		};
	}

	return {
		status: "error",
		message: getAuthErrorMessage(undefined, "Authentication failed."),
	};
}

export async function loginWithEmail(
	client: WixClient,
	email: string,
	password: string
): Promise<AuthFlowResult> {
	const response = await client.auth.login({ email, password });
	return handleAuthStateMachine(client, response);
}

export async function registerWithEmail(
	client: WixClient,
	email: string,
	password: string,
	profile?: MemberProfile
): Promise<AuthFlowResult> {
	const response = await client.auth.register({ email, password, profile });
	return handleAuthStateMachine(client, response);
}

export async function verifyEmailCode(
	client: WixClient,
	verificationCode: string,
	pendingState?: StateMachine
): Promise<AuthFlowResult> {
	const response = await client.auth.processVerification(
		{ verificationCode },
		pendingState
	);
	return handleAuthStateMachine(client, response);
}

export async function fetchCurrentMember(
	client: WixClient
): Promise<WixMember | null> {
	if (!client.auth.loggedIn()) return null;

	try {
		const { member } = await client.members.getCurrentMember({
			fieldsets: [members.Set.FULL],
		});
		return (member as WixMember | undefined) ?? null;
	} catch (e) {
		console.error("getCurrentMember with FULL fieldset failed:", e);
		try {
			const { member } = await client.members.getCurrentMember();
			return (member as WixMember | undefined) ?? null;
		} catch (err) {
			console.error("getCurrentMember also failed:", err);
			return null;
		}
	}
}

export function memberDisplayName(member: WixMember | null): string {
	if (!member) return "Member";
	const profile = member.profile;
	const contact = member.contact;
	return (
		profile?.nickname ||
		[
			profile?.firstName ?? contact?.firstName,
			profile?.lastName ?? contact?.lastName,
		]
			.filter(Boolean)
			.join(" ") ||
		member.loginEmail ||
		"Member"
	);
}

export function memberEmail(member: WixMember | null): string {
	return (
		member?.loginEmail ||
		(member as WixMember & { email?: string })?.email ||
		member?.contact?.emails?.[0]?.email ||
		""
	);
}

export function memberAvatar(member: WixMember | null): string {
	return (
		member?.profile?.photo?.url ??
		"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
	);
}
