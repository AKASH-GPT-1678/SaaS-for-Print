"use client";
import React from "react";
import { useState } from "react";
import { createOrderId } from "@/lib/orderid";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [price] = React.useState(10);
  const [error, setError] = useState("");
  const router = useRouter();
  const token = useAppSelector((state) => state.data.token);

  const handlePayment = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const orderId = await createOrderId(price, "INR");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "SaasPrint",
        order_id: orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            await axios.post("/api/verifyOrder", {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push("/qr");
          } catch (err) {
            console.error(err);
            setError("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as unknown as {
        Razorpay: new (opts: unknown) => {
          on: (event: string, cb: (response: { error: unknown }) => void) => void;
          open: () => void;
        };
      }).Razorpay(options);
      razorpay.on("payment.failed", function () {
        setError("Payment failed");
      });
      razorpay.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      setError("Could not start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-60"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate QR"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
}
