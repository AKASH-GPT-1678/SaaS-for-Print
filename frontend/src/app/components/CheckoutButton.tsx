"use client";
import React from "react";
import { useState } from "react";
import { createOrderId } from "@/lib/orderid";
import axios from "axios";
import Script from "next/script";
import toast from 'react-hot-toast'
import { useAppSelector } from "@/lib/hooks";


export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [price, setprice] = React.useState(10);
  const [show, setShow] = React.useState(false);
  const token = useAppSelector((state) => state.data.token);

  const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;
async function updateStatus() {
  try {
    const response = await axios.post(
      "http://localhost:8080/qr/qrstats",
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data;

  } catch (error :any) {
    console.error("Error updating status:", error.response?.data || error.message);
    throw error;
  }
}



  const handlePayment = async () => {
    // if (!isVerified) {


    //     toast.error('Login for Premium Access');
      
    //   return;
    // }


    try {
      const orderId = await createOrderId(price, "INR");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "Gupta Company",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const paymentResponse = await axios.post("/api/verifyOrder", {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });


            alert("Payment Successful!");
            console.log(paymentResponse.data);

            await updateStatus();
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
            console.error(error);
          }
        },
        prefill: {
          name: "YOUR_NAME",
          email: "acashgupta960@gmail.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        alert("Payment failed");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  return (
    <>
      <button
        className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate QR Tokens"}
      </button>

      
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );

}


