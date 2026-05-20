import { Lora } from "next/font/google";

import { cn } from "@/lib/utils";

import { BundleLandingClient } from "./BundleLandingClient";
import type { BundleData } from "./types/bundle";

import "./styles/bundleAnimations.css";

const bundleLora = Lora({
	variable: "--bundle-lora",
	subsets: ["latin"],
	display: "swap",
	weight: ["400"],
});

interface BundleLandingPageProps {
	bundle: BundleData;
}

export function BundleLandingPage({ bundle }: BundleLandingPageProps) {
	return (
		<main className={cn(bundleLora.variable, "bundle-page")}>
			<BundleLandingClient bundle={bundle} />
		</main>
	);
}
