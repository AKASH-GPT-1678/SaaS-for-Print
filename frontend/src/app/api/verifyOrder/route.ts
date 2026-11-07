import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export interface VerifyBody {
	razorpay_order_id: string;
	razorpay_payment_id?: string;
	razorpay_signature?: string;
	expectedAmount?: number;
	expectedCurrency?: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: VerifyBody = await request.json();
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
		if (
			typeof razorpay_order_id !== "string" ||
			!razorpay_order_id.startsWith("order_")
		)
			return NextResponse.json(
				{ message: "Invalid order ID", success: false },
				{ status: 400 },
			);
		const keyId = process.env.RAZORPAY_KEY_ID;
		const secret = process.env.RAZORPAY_SECRET_KEY;
		if (!keyId || !secret)
			return NextResponse.json(
				{ message: "Payments are not configured", success: false },
				{ status: 503 },
			);

		// Checkout callbacks must pass signature verification. A request with only an order ID
		// reconciles payment directly with Razorpay when a browser missed the callback.
		if (razorpay_payment_id !== undefined || razorpay_signature !== undefined) {
			if (
				typeof razorpay_payment_id !== "string" ||
				typeof razorpay_signature !== "string" ||
				!/^[a-f0-9]{64}$/i.test(razorpay_signature)
			)
				return NextResponse.json(
					{ message: "Invalid payment details", success: false },
					{ status: 400 },
				);
			const expected = crypto
				.createHmac("sha256", secret)
				.update(`${razorpay_order_id}|${razorpay_payment_id}`)
				.digest();
			if (
				!crypto.timingSafeEqual(
					expected,
					Buffer.from(razorpay_signature, "hex"),
				)
			)
				return NextResponse.json(
					{ message: "Invalid signature", success: false },
					{ status: 400 },
				);
		}
		const amount = body.expectedAmount ?? 1000;
		const currency = body.expectedCurrency ?? "INR";
		if (
			!Number.isSafeInteger(amount) ||
			amount < 100 ||
			typeof currency !== "string"
		)
			return NextResponse.json(
				{ message: "Invalid expected amount", success: false },
				{ status: 400 },
			);
		const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
		const result = await razorpay.orders.fetchPayments(razorpay_order_id);
		const payment = result.items.find(
			(item) =>
				item.order_id === razorpay_order_id &&
				item.status === "captured" &&
				Number(item.amount) === amount &&
				item.currency === currency &&
				Number(item.amount_refunded ?? 0) === 0 &&
				(!razorpay_payment_id || item.id === razorpay_payment_id),
		);
		if (!payment)
			return NextResponse.json(
				{
					message:
						"Payment is not captured yet. Check again before paying again.",
					success: false,
				},
				{ status: 409 },
			);
		return NextResponse.json({
			success: true,
			message: "Payment verified successfully",
			payment: {
				id: payment.id,
				order_id: payment.order_id,
				status: payment.status,
				amount: Number(payment.amount),
				currency: payment.currency,
				amount_refunded: Number(payment.amount_refunded ?? 0),
			},
		});
	} catch {
		return NextResponse.json(
			{ message: "Could not verify payment. Please retry.", success: false },
			{ status: 502 },
		);
	}
}
