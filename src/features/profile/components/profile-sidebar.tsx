"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { ChevronRight, LogOut, LucideIcon } from "lucide-react";

interface Tab {
	id: string;
	label: string;
	icon: LucideIcon;
}

interface ProfileSidebarProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (id: string) => void;
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}

export const ProfileSidebar = ({
	tabs,
	activeTab,
	onTabChange,
	user,
}: ProfileSidebarProps) => {
	return (
		<aside className="w-full shrink-0 lg:w-80">
			<div className="sticky top-32 space-y-8">
				{/* Profile Brief */}
				<div className="flex items-center gap-4 rounded-3xl border border-stone-100 bg-stone-50 p-4">
					<div className="relative size-16 overflow-hidden rounded-full border-2 border-white shadow-soft">
						<Image
							alt="User Avatar"
							className="object-cover"
							fill
							src={user.avatar}
						/>
					</div>
					<div>
						<h2 className="font-bold text-secondary">{user.name}</h2>
						<p className="text-sm text-stone-400">{user.email}</p>
					</div>
				</div>

				{/* Nav Links */}
				<nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
					{tabs.map((tab) => (
						<button
							className={`flex shrink-0 items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all duration-300 lg:shrink lg:px-6 lg:py-4 ${
								activeTab === tab.id
									? "bg-primary text-white shadow-heavy"
									: "text-secondary hover:bg-stone-50"
							}`}
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
						>
							<tab.icon size={18} />
							<span className="font-bold text-xm">{tab.label}</span>
							{activeTab === tab.id && (
								<motion.div className="ml-auto" layoutId="active-tab-indicator">
									<ChevronRight size={16} />
								</motion.div>
							)}
						</button>
					))}
					<div className="mt-4 border-stone-100 border-t pt-4">
						<button className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-left text-red-500 transition-colors hover:bg-red-50">
							<LogOut size={18} />
							<span className="font-bold text-xm">Sign Out</span>
						</button>
					</div>
				</nav>
			</div>
		</aside>
	);
};
