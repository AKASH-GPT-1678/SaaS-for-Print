import { NextResponse } from "next/server";
import Razorpay from "razorpay";


const RazorpayKey = process.env.RAZORPAY_KEY_ID as string;
const RazorpaySecret = process.env.RAZORPAY_SECRET_KEY as string;

if (!RazorpaySecret || !RazorpayKey) {
    throw new Error("Razorpay keys are missing");
}


const razorpay = new Razorpay({
    key_id: RazorpayKey,
    key_secret: RazorpaySecret


});

export type OrderBody = {
    amount: number;
    currency: string;
}

export async function POST(req: Request) {




    try {
        const { amount, currency }: OrderBody = await req.json();
        if (!amount) {
            return NextResponse.json({ message: `Amount is required` }, { status: 400 })
        }

        const options = {
            amount,
            currency: currency || "INR",
            receipt: `receipt#${Date.now()}`,
        }


        const order = await razorpay.orders.create(options);
        console.log("Order Created Successfully");
        return NextResponse.json({ orderId: order.id }, { status: 200 })





    } catch (error) {
        return NextResponse.json({ message: "Server Error", error }, { status: 500 })

    }

}