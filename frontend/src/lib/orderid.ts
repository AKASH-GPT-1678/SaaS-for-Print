import axios from "axios";

export async function createOrderId(amount: number, currency: string) {
  try {
    const response = await axios.post("/api/createOrder", {
      amount: amount * 100,
      currency: currency || "INR",
    });
    return response.data.orderId as string;
  } catch {
    throw new Error("Failed to create order");
  }
}
