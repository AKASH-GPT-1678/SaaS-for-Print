"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useState } from "react";
import { createOrderId } from "@/lib/orderid";
import { useAuthStore } from "@/stores/auth-store";

export type CheckoutOrder = {
	orderId: string;
	keyId: string;
	amount: number;
	currency: string;
};
export type CheckoutProof = {
	razorpay_order_id: string;
	razorpay_payment_id: string;
	razorpay_signature: string;
};
type Options = {
	key: string;
	order_id: string;
	amount: number;
	currency: string;
	name: string;
	description: string;
	theme: { color: string };
	handler: (proof: CheckoutProof) => void;
	modal: { ondismiss: () => void };
};
type RazorpayConstructor = new (options: Options) => { open: () => void };
export function requireCheckout() {
	const checkoutConstructor = (
		window as unknown as { Razorpay?: RazorpayConstructor }
	).Razorpay;
	if (!checkoutConstructor)
		throw new Error("Payment checkout is still loading. Please try again.");
	return checkoutConstructor;
}

export function openRazorpayCheckout(order: CheckoutOrder) {
	const Razorpay = requireCheckout();
	return new Promise<CheckoutProof | null>((resolve) => {
		new Razorpay({
			key: order.keyId,
			order_id: order.orderId,
			amount: order.amount,
			currency: order.currency,
			name: "Printar",
			description: "Shop upload QR code",
			theme: { color: "#173f37" },
			handler: resolve,
			modal: { ondismiss: () => resolve(null) },
		}).open();
	});
}

type Props = {
	onPayment?: () => Promise<void>;
	disabled?: boolean;
	label?: string;
	className?: string;
};
export default function CheckoutButton({
	onPayment,
	disabled = false,
	label = "Generate QR",
	className,
}: Props = {}) {
	const [loading, setLoading] = useState(false);
	const [price] = React.useState(10);
	const [error, setError] = useState("");
	const router = useRouter();
	const token = useAuthStore((state) => state.token);

	const handlePayment = async () => {
		if (!token) {
			router.push("/login");
			return;
		}

		setError("");
		setLoading(true);
		try {
			if (onPayment) {
				await onPayment();
				return;
			}
			const orderId = await createOrderId(price, "INR");
			const { data } = await axios.get<{ keyId: string }>("/api/createOrder");
			const proof = await openRazorpayCheckout({
				orderId,
				keyId: data.keyId,
				amount: price * 100,
				currency: "INR",
			});
			if (!proof) return;
			await axios.post("/api/verifyOrder", proof);
			router.push("/qr");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not start payment");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				type="button"
				className={
					className ||
					"bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-60"
				}
				onClick={handlePayment}
				disabled={disabled || loading}
			>
				{loading ? "Processing..." : label}
			</button>
			{error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

			<Script
				id="razorpay-checkout-js"
				src="https://checkout.razorpay.com/v1/checkout.js"
			/>
		</>
	);
}
