"use client";

import { useCallback, useEffect, useState } from "react";

import { OrdersTab } from "@/features/profile/components/orders-tab";
import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";
import { ProfileStatusBanner } from "@/features/profile/components/profile-status-banner";
import { fetchCurrentMember } from "@/lib/wix/auth-actions";
import {
	asOrdersClient,
	fetchMemberOrders,
	type ProfileOrder,
} from "@/lib/wix/profile-actions";
import { useWixAuth, useWixClient } from "@/lib/wix/provider";

export const OrdersPage = () => {
	const wixClient = useWixClient();
	const { member } = useWixAuth();
	const [orders, setOrders] = useState<ProfileOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		if (!wixClient) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const m = (await fetchCurrentMember(wixClient)) ?? member;
			const memberId = m?._id;
			if (!memberId) {
				setOrders([]);
				return;
			}

			let list = await fetchMemberOrders(asOrdersClient(wixClient), memberId);
			if (list.length === 0) {
				const res = await fetch("/api/profile/orders");
				if (res.ok) {
					const data = (await res.json()) as { orders?: ProfileOrder[] };
					list = data.orders ?? [];
				}
			}
			setOrders(list);
		} catch {
			setError(
				"Could not load orders. Ensure Read Orders permission is enabled for your OAuth app."
			);
		} finally {
			setLoading(false);
		}
	}, [wixClient, member]);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<>
			<ProfilePageHeader
				description="Manage and track your previous purchases"
				title="My Orders"
			/>
			{error ? <ProfileStatusBanner message={error} /> : null}
			<OrdersTab loading={loading} orders={orders} />
		</>
	);
};
