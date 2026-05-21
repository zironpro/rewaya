"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PaymentTab } from "@/features/profile/components/payment-tab";
import { ProfilePageHeader } from "@/features/profile/components/profile-page-header";
import { fetchCurrentMember } from "@/lib/wix/auth-actions";
import {
	asOrdersClient,
	extractPaymentMethodsFromOrders,
	fetchMemberOrders,
	fetchMemberOrdersRaw,
	type ProfilePaymentMethod,
} from "@/lib/wix/profile-actions";
import { useWixAuth, useWixClient } from "@/lib/wix/provider";

export const PaymentPage = () => {
	const router = useRouter();
	const wixClient = useWixClient();
	const { member } = useWixAuth();
	const [methods, setMethods] = useState<ProfilePaymentMethod[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(async () => {
		if (!wixClient) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const m = (await fetchCurrentMember(wixClient)) ?? member;
			const memberId = m?._id;
			if (!memberId) {
				setMethods([]);
				return;
			}
			const ordersClient = asOrdersClient(wixClient);
			const raw = await fetchMemberOrdersRaw(ordersClient, memberId);
			const orders = await fetchMemberOrders(ordersClient, memberId);
			setMethods(extractPaymentMethodsFromOrders(orders, raw));
		} finally {
			setLoading(false);
		}
	}, [wixClient, member]);

	useEffect(() => {
		load();
	}, [load]);

	const handleAddCard = () => {
		router.push("/cart");
	};

	return (
		<>
			<ProfilePageHeader
				action={
					<Button
						className="h-12 gap-2 rounded-2xl px-6"
						onClick={handleAddCard}
						variant="premium"
					>
						<Plus size={18} />
						Add new card
					</Button>
				}
				description="Cards from past orders and checkout"
				title="Payment Methods"
			/>
			<PaymentTab
				loading={loading}
				onAddCard={handleAddCard}
				paymentMethods={methods}
			/>
			<p className="text-center text-stone-400 text-xs">
				<Link className="text-primary underline" href="/cart">
					Go to cart
				</Link>{" "}
				to complete checkout and save a payment method with Wix.
			</p>
		</>
	);
};
