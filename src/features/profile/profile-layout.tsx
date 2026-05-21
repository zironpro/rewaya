"use client";

import { useEffect } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

import { ProfileSidebar } from "@/features/profile/components/profile-sidebar";
import { profileNavItems } from "@/features/profile/data/profile-data";
import { useWixAuth } from "@/lib/wix/provider";

const PROFILE_SHELL = "grow pt-20 pb-28 md:pb-16";

function breadcrumbItems(pathname: string) {
	if (pathname === "/profile") {
		return [{ label: "My Profile" }];
	}
	const segment = pathname.split("/").pop() ?? "";
	const labels: Record<string, string> = {
		orders: "Orders",
		addresses: "Addresses",
		payment: "Payment",
		settings: "Settings",
	};
	const label = labels[segment] ?? "My Profile";
	return [
		{ label: "My Profile", href: "/profile" },
		{ label },
	];
}

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();
	const {
		isReady,
		isLoggedIn,
		isPending,
		memberDisplayName,
		memberEmail,
		memberAvatar,
		logout,
	} = useWixAuth();

	const returnUrl = pathname || "/profile";

	useEffect(() => {
		if (isReady && !isLoggedIn) {
			router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
		}
	}, [isReady, isLoggedIn, returnUrl, router]);

	if (!isReady) {
		return (
			<main className={PROFILE_SHELL}>
				<div className="container py-16 md:py-24">
					<p className="font-bold text-secondary text-sm">Loading profile…</p>
				</div>
			</main>
		);
	}

	if (!isLoggedIn) {
		return (
			<main className={PROFILE_SHELL}>
				<div className="container py-16 text-center md:py-24">
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
		email: memberEmail,
		avatar: memberAvatar,
	};

	return (
		<main className={PROFILE_SHELL}>
			<div className="container">
				<Breadcrumbs
					className="mb-6 md:mb-8"
					items={breadcrumbItems(pathname)}
				/>

				<div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
					<ProfileSidebar
						isLoggingOut={isPending}
						navItems={profileNavItems}
						onLogout={logout}
						user={user}
					/>

					<section className="min-w-0 flex-1 space-y-6 lg:space-y-8">
						{children}
					</section>
				</div>
			</div>
		</main>
	);
};
