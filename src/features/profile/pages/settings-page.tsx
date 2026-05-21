"use client";

import { useCallback, useEffect, useState } from "react";

import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";
import { SettingsTab } from "@/features/profile/components/settings-tab";
import {
	fetchCurrentMember,
	memberEmail,
	type WixMember,
} from "@/lib/wix/auth-actions";
import { memberPhone, updateMemberProfile } from "@/lib/wix/profile-actions";
import { useWixAuth, useWixClient } from "@/lib/wix/provider";

export const SettingsPage = () => {
	const wixClient = useWixClient();
	const {
		member,
		refreshMember,
		sendPasswordReset,
		logout,
		isPending,
		memberEmail: emailFromAuth,
	} = useWixAuth();
	const [currentMember, setCurrentMember] = useState<WixMember | null>(member);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const load = useCallback(async () => {
		if (!wixClient) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const m = (await fetchCurrentMember(wixClient)) ?? member;
			setCurrentMember(m);
		} finally {
			setLoading(false);
		}
	}, [wixClient, member]);

	useEffect(() => {
		load();
	}, [load]);

	const handleSave = async (data: {
		firstName: string;
		lastName: string;
		nickname: string;
		phone: string;
	}) => {
		if (!wixClient || !currentMember) return false;
		setSaving(true);
		try {
			const updated = await updateMemberProfile(
				wixClient,
				currentMember,
				data
			);
			if (updated) {
				setCurrentMember(updated);
				await refreshMember();
				return true;
			}
			return false;
		} finally {
			setSaving(false);
		}
	};

	const phone = memberPhone(currentMember);
	const phoneValue = phone === "—" ? "" : phone;

	if (loading) {
		return (
			<div className="py-16 text-center text-sm text-stone-400 md:py-24">
				Loading settings…
			</div>
		);
	}

	return (
		<>
			<ProfilePageHeader
				description="Manage your account preferences"
				title="Settings"
			/>
			<SettingsTab
				email={memberEmail(currentMember) || emailFromAuth}
				firstName={
					currentMember?.contact?.firstName ??
					currentMember?.profile?.firstName ??
					""
				}
				isLoggingOut={isPending}
				isSaving={saving}
				lastName={
					currentMember?.contact?.lastName ??
					currentMember?.profile?.lastName ??
					""
				}
				nickname={currentMember?.profile?.nickname ?? ""}
				onLogout={logout}
				onResetPassword={() => sendPasswordReset(emailFromAuth)}
				onSave={handleSave}
				phone={phoneValue}
			/>
		</>
	);
};
