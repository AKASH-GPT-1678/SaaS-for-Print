import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

export interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: VerifyBody = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Missing required parameters", success: false },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { message: "Payments are not configured", success: false },
        { status: 503 }
      );
    }

    const HMAC = crypto.createHmac("sha256", secret);
    HMAC.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = HMAC.digest("hex");

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        message: "Payment verified successfully",
        success: true,
      });
    }

    return NextResponse.json(
      { message: "Invalid signature", success: false },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred", success: false },
      { status: 500 }
    );
  }
}
