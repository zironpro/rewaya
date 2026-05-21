"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddressesTab } from "@/features/profile/components/addresses-tab";
import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";
import { fetchCurrentMember, type WixMember } from "@/lib/wix/auth-actions";
import {
	mapWixAddresses,
	type ProfileAddress,
} from "@/lib/wix/profile-actions";
import { useWixAuth, useWixClient } from "@/lib/wix/provider";

export const AddressesPage = () => {
	const wixClient = useWixClient();
	const { member } = useWixAuth();
	const [addresses, setAddresses] = useState<ProfileAddress[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		if (!wixClient) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const m: WixMember | null =
				(await fetchCurrentMember(wixClient)) ?? member;
			setAddresses(mapWixAddresses(m));
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
				action={
					<Button
						className="h-12 gap-2 rounded-2xl px-6"
						nativeButton={false}
						render={<Link href="/profile/settings" />}
						variant="premium"
					>
						<Plus size={18} />
						Add address
					</Button>
				}
				description="Manage your shipping and billing addresses"
				title="My Addresses"
			/>
			<AddressesTab addresses={addresses} loading={loading} />
		</>
	);
};
