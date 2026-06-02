"use client";

import { useEffect, useRef } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

import { trackMetaEvent } from "@/lib/analytics/meta";

/**
 * Loads Meta Pixel script and fires a PageView event on initial load and on every route change.
 * Uses a tiny client‑side helper to ensure deduplication via a generated event_id.
 */
export default function MetaPixelProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const hasTrackedInitialPageView = useRef(false);

	// Fire PageView on route change (client navigation)
	useEffect(() => {
		if (!pixelId) {
			return;
		}

		const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;

		// Prevent duplicate initial PageView (Script already tracks once on first load).
		if (!hasTrackedInitialPageView.current) {
			hasTrackedInitialPageView.current = true;
			return;
		}

		trackMetaEvent("PageView", { event_source_url: url });
	}, [pathname, pixelId, searchParams]);

	if (!pixelId) {
		return <>{children}</>;
	}

	return (
		<>
			<Script id="meta-pixel" strategy="afterInteractive">
				{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
				n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
				n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
				t=b.createElement(e);t.async=!0;
				t.src=v;s=b.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t,s)}(window, document,'script',
				'https://connect.facebook.net/en_US/fbevents.js');
				fbq('init', '${pixelId}');
				fbq('track', 'PageView');`}
			</Script>
			{children}
		</>
	);
}
