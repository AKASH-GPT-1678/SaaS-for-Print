"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaClockRotateLeft } from "react-icons/fa6";
import { HiOutlineCalculator } from "react-icons/hi";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuShoppingBag, LuUsers } from "react-icons/lu";

const links = [
	{ label: "QR codes", href: "/qr", icon: IoQrCodeOutline },
	{ label: "Shopping bag", href: "/qr", icon: LuShoppingBag },
	{ label: "Calculator", href: "/", icon: HiOutlineCalculator },
	{ label: "Customers", href: "/", icon: LuUsers },
	{ label: "Staff", href: "/", icon: LuUsers },
	{ label: "Schedule", href: "/schedule", icon: FaClockRotateLeft },
	{ label: "Contacts", href: "/", icon: LuUsers },
	{ label: "Teams", href: "/", icon: LuUsers },
	{ label: "People", href: "/", icon: LuUsers },
];

export default function SideBar() {
	const router = useRouter();
	return (
		<nav className="h-screen" aria-label="Sidebar">
			<Image
				src="/favicon.ico"
				alt="Printar"
				className="h-12 w-12"
				height={48}
				width={48}
			/>
			<div className="mb-2 p-2" aria-hidden="true">
				<AiOutlineClockCircle className="h-8 w-8" />
			</div>
			{links.map(({ label, href, icon: Icon }) => (
				<button
					key={label}
					type="button"
					aria-label={label}
					className="mb-2 cursor-pointer rounded p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
					onClick={() => router.push(href)}
				>
					<Icon className="h-8 w-8" aria-hidden="true" />
				</button>
			))}
		</nav>
	);
}
