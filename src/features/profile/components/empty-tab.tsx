"use client";

import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface EmptyTabProps {
	onBack: () => void;
}

export const EmptyTab = ({ onBack }: EmptyTabProps) => {
	return (
		<Card className="rounded-[2rem] border-stone-100 p-12 text-center shadow-soft">
			<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-stone-50">
				<Settings className="text-stone-300" size={32} />
			</div>
			<CardTitle className="mb-4 font-serif text-3xl">Coming Soon</CardTitle>
			<CardDescription className="mx-auto max-w-xs">
				We're currently working on this section to provide you with the best
				experience. Stay tuned!
			</CardDescription>
			<Button className="mt-8 h-12 px-8" onClick={onBack} variant="premium">
				Back to Overview
			</Button>
		</Card>
	);
};
