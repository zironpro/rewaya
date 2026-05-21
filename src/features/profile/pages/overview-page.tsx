"use client";

import { useCallback, useEffect, useState } from "react";

import { OverviewTab } from "@/features/profile/components/overview-tab";
import {
	fetchCurrentMember,
	memberEmail,
	type WixMember,
} from "@/lib/wix/auth-actions";
import {
	asOrdersClient,
	fetchMemberOrders,
	memberPhone,
	type ProfileOrder,
} from "@/lib/wix/profile-actions";
import { useWixAuth, useWixClient } from "@/lib/wix/provider";

export const OverviewPage = () => {
	const wixClient = useWixClient();
	const { member, refreshMember } = useWixAuth();
	const [orders, setOrders] = useState<ProfileOrder[]>([]);
	const [currentMember, setCurrentMember] = useState<WixMember | null>(member);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		if (!wixClient) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const m = (await fetchCurrentMember(wixClient)) ?? member;
			setCurrentMember(m);
			if (m?._id) {
				const list = await fetchMemberOrders(asOrdersClient(wixClient), m._id);
				setOrders(list);
			} else {
				setOrders([]);
			}
			await refreshMember();
		} finally {
			setLoading(false);
		}
	}, [wixClient, member, refreshMember]);

	useEffect(() => {
		load();
	}, [load]);

	const firstName =
		currentMember?.contact?.firstName ??
		currentMember?.profile?.firstName ??
		"";
	const lastName =
		currentMember?.contact?.lastName ?? currentMember?.profile?.lastName ?? "";

	return (
		<OverviewTab
			email={memberEmail(currentMember)}
			firstName={firstName}
			lastName={lastName}
			loading={loading}
			orders={orders}
			phone={memberPhone(currentMember)}
		/>
	);
};
