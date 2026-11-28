"use client";
import { DM_Sans, Manrope } from "next/font/google";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { LandingHero } from "./LandingHero";
import {
	FinalSection,
	FlowSection,
	RoadmapSection,
	ShopSection,
	ToolkitSection,
} from "./LandingSections";
import { cx } from "./landingStyles";

const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
});
const manrope = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope",
});

export function LandingPage() {
	const router = useRouter();
	const isHydrated = useAuthStore((state) => state.isHydrated);
	const token = useAuthStore((state) => state.token);

	React.useEffect(() => {
		if (isHydrated && token) {
			router.replace("/dashboard");
		}
	}, [isHydrated, token, router]);

	return (
		<div className={`${cx("landing")} ${dmSans.variable} ${manrope.variable}`}>
			<LandingHeader />
			<main>
				<LandingHero />
				<ToolkitSection />
				<FlowSection />
				<ShopSection />
				<RoadmapSection />
				<FinalSection />
			</main>
			<LandingFooter />
		</div>
	);
}
