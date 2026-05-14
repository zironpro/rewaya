"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

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
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<main className="grow pt-24 pb-32">
			<div className="container mx-auto px-6">
				<Breadcrumbs className="mb-12" items={[{ label: "My Profile" }]} />

				<div className="flex flex-col gap-12 lg:flex-row">
					<ProfileSidebar
						activeTab={activeTab}
						onTabChange={setActiveTab}
						tabs={tabs}
						user={mockUser}
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
