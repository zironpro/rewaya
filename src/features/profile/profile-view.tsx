"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

import { useWixAuth } from "@/lib/wix/provider";

import { AddressesTab } from "./components/addresses-tab";
import { EmptyTab } from "./components/empty-tab";
import { OrdersTab } from "./components/orders-tab";
import { OverviewTab } from "./components/overview-tab";
import { PaymentTab } from "./components/payment-tab";
import { ProfileSidebar } from "./components/profile-sidebar";
import {
	mockAddresses,
	mockOrders,
	mockPaymentMethods,
	mockUser,
	tabs,
} from "./data/profile-data";

export const ProfileView = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("overview");
	const {
		isReady,
		isLoggedIn,
		isPending,
		memberDisplayName,
		memberEmail,
		memberAvatar,
		logout,
	} = useWixAuth();

	useEffect(() => {
		if (isReady && !isLoggedIn) {
			router.replace("/login?returnUrl=/profile");
		}
	}, [isReady, isLoggedIn, router]);

	if (!isReady) {
		return (
			<main className="grow pt-24 pb-28 md:pb-16">
				<div className="container">
					<p className="font-bold text-secondary text-sm">Loading profile…</p>
				</div>
			</main>
		);
	}

	if (!isLoggedIn) {
		return (
			<main className="grow pt-24 pb-28 md:pb-16">
				<div className="container text-center">
					<p className="mb-6 font-bold text-secondary">
						Sign in to view your profile.
					</p>
					<Button nativeButton={false} render={<Link href="/login" />}>
						Log in
					</Button>
				</div>
			</main>
		);
	}

	const user = {
		name: memberDisplayName,
		email: memberEmail || mockUser.email,
		avatar: memberAvatar,
	};

	return (
		<main className="grow pt-24 pb-28 md:pb-16">
			<div className="container">
				<Breadcrumbs className="mb-12" items={[{ label: "My Profile" }]} />

				<div className="flex flex-col gap-12 lg:flex-row">
					<ProfileSidebar
						activeTab={activeTab}
						isLoggingOut={isPending}
						onLogout={logout}
						onTabChange={setActiveTab}
						tabs={tabs}
						user={user}
					/>

					<section className="grow">
						<AnimatePresence mode="wait">
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								className="space-y-8"
								exit={{ opacity: 0, y: -10 }}
								initial={{ opacity: 0, y: 10 }}
								key={activeTab}
								transition={{ duration: 0.2 }}
							>
								{activeTab === "overview" && (
									<OverviewTab orders={mockOrders} />
								)}
								{activeTab === "orders" && <OrdersTab orders={mockOrders} />}
								{activeTab === "addresses" && (
									<AddressesTab addresses={mockAddresses} />
								)}
								{activeTab === "payment" && (
									<PaymentTab paymentMethods={mockPaymentMethods} />
								)}
								{activeTab === "settings" && (
									<EmptyTab onBack={() => setActiveTab("overview")} />
								)}
							</motion.div>
						</AnimatePresence>
					</section>
				</div>
			</div>
		</main>
	);
};
