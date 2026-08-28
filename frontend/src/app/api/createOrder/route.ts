import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export type OrderBody = {
  amount: number;
  currency: string;
};

const MIN_AMOUNT_PAISE = 100;
const MAX_AMOUNT_PAISE = 10000000;

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET_KEY;
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(req: Request) {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        { message: "Payments are not configured" },
        { status: 503 }
      );
    }

    const { amount, currency }: OrderBody = await req.json();
    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ message: "Amount is required" }, { status: 400 });
    }
    if (amount < MIN_AMOUNT_PAISE || amount > MAX_AMOUNT_PAISE) {
      return NextResponse.json({ message: "Amount is out of range" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: currency || "INR",
      receipt: `receipt#${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
