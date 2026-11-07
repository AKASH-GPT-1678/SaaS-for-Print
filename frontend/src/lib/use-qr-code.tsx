"use client";

import { useCallback, useRef, useState } from "react";
import {
	openRazorpayCheckout,
	requireCheckout,
} from "@/app/components/CheckoutButton";
import { api, getApiErrorMessage } from "@/lib/api";

export type SavedQr = {
	id: string;
	name: string;
	qrCodeUrl: string | null;
	active: boolean;
	paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
	createdAt: string;
	generatedAt: string | null;
	image: string | null;
	amountPaise: number;
	currency: string;
};
type Checkout = {
	qrId: string;
	orderId: string;
	keyId: string;
	amount: number;
	currency: string;
};

const useQRCodes = () => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [progress, setProgress] = useState("");
	const inFlight = useRef(false);
	const getQrCodes = useCallback(async (signal?: AbortSignal) => {
		const { data } = await api.get<SavedQr[]>("/qr", { signal });
		return data;
	}, []);

	async function generateQr(id: string) {
		setProgress("Generating your paid QR code…");
		// Keep errors as JSON so payment/storage failures retain their useful message.
		await api.post(`/qr/${id}/generate`);
	}

	async function pay(order: Checkout) {
		setProgress("Complete payment in the checkout window.");
		const proof = await openRazorpayCheckout(order);
		if (!proof) {
			setProgress(
				"Checkout closed. Resume it or check payment from your QR card.",
			);
			return false;
		}
		setProgress("Verifying payment…");
		await api.post(`/qr/${order.qrId}/verify-payment`, proof);
		await generateQr(order.qrId);
		setProgress("Payment verified. Your QR code is ready.");
		return true;
	}

	async function run(action: () => Promise<boolean>) {
		if (inFlight.current) return false;
		inFlight.current = true;
		setBusy(true);
		setError("");
		try {
			return await action();
		} catch (err) {
			setError(
				getApiErrorMessage(
					err,
					"Could not complete QR creation. Check payment on your QR card before paying again.",
				),
			);
			setProgress("");
			return false;
		} finally {
			inFlight.current = false;
			setBusy(false);
		}
	}

	async function createQr(name: string) {
		return run(async () => {
			requireCheckout();
			setProgress("Creating your payment order…");
			const { data } = await api.post<Checkout>("/qr/orders", { name });
			return pay(data);
		});
	}

	async function resumeCheckout(id: string) {
		return run(async () => {
			requireCheckout();
			// Reconcile first so a captured payment is never followed by another checkout.
			try {
				await api.post(`/qr/${id}/verify-payment`);
			} catch (err) {
				const status = (err as { response?: { status?: number } }).response
					?.status;
				if (status !== 409) throw err;
				const { data } = await api.get<Checkout>(`/qr/${id}/checkout`);
				return pay(data);
			}
			await generateQr(id);
			setProgress("Payment verified. Your QR code is ready.");
			return true;
		});
	}

	async function retryGeneration(id: string) {
		return run(async () => {
			setProgress("Checking payment…");
			await api.post(`/qr/${id}/verify-payment`);
			await generateQr(id);
			setProgress("Your QR code is ready.");
			return true;
		});
	}

	return {
		getQrCodes,
		createQr,
		resumeCheckout,
		retryGeneration,
		busy,
		error,
		progress,
	};
};

export default useQRCodes;
