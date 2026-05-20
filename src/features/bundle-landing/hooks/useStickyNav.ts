"use client";

import { useEffect, useRef, useState } from "react";

/**
 * When the hero leaves the viewport, sticky chrome (nav + mobile bar) can appear.
 */
export function useStickyNav() {
	const heroRef = useRef<HTMLElement | null>(null);
	const [pastHero, setPastHero] = useState(false);

	useEffect(() => {
		const hero = heroRef.current;
		if (!hero) return;

		const obs = new IntersectionObserver(
			([entry]) => {
				setPastHero(!entry.isIntersecting);
			},
			{ rootMargin: "-48px 0px 0px 0px", threshold: 0 }
		);

		obs.observe(hero);
		return () => obs.disconnect();
	}, []);

	return { heroRef, pastHero };
}
