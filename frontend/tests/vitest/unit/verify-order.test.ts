import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { POST } from "@/app/api/verifyOrder/route";

const { fetchPayments } = vi.hoisted(() => ({ fetchPayments: vi.fn() }));
vi.mock("razorpay", () => ({ default: class { orders = { fetchPayments }; } }));
const payment = { id: "pay_one", order_id: "order_one", status: "captured", amount: 1000, currency: "INR", amount_refunded: 0 };
function request(body: object) {
  return POST(new NextRequest("http://localhost:3000/api/verifyOrder", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
  }));
}
function proof() {
  return { razorpay_order_id: "order_one", razorpay_payment_id: "pay_one",
    razorpay_signature: crypto.createHmac("sha256", "test_secret").update("order_one|pay_one").digest("hex") };
}
beforeEach(() => {
  vi.stubEnv("RAZORPAY_KEY_ID", "test_key"); vi.stubEnv("RAZORPAY_SECRET_KEY", "test_secret");
  fetchPayments.mockResolvedValue({ items: [payment] });
});
describe("existing Next.js payment verification", () => {
  it("verifies the checkout signature and captured payment using server-side keys", async () => {
    const response = await request(proof());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, payment: { id: "pay_one", amount: 1000 } });
    expect(fetchPayments).toHaveBeenCalledWith("order_one");
  });
  it("rejects a forged signature before contacting Razorpay", async () => {
    const response = await request({ ...proof(), razorpay_signature: "0".repeat(64) });
    expect(response.status).toBe(400); expect(fetchPayments).not.toHaveBeenCalled();
  });
  it.each([
    { status: "authorized" }, { amount: 100 }, { amount_refunded: 1000 },
    { order_id: "order_other" }, { currency: "USD" },
  ])("does not approve a mismatching or uncaptured payment: %o", async (difference) => {
    fetchPayments.mockResolvedValue({ items: [{ ...payment, ...difference }] });
    expect((await request(proof())).status).toBe(409);
  });
  it("recovers a captured payment after a missed browser callback by asking Razorpay", async () => {
    const response = await request({ razorpay_order_id: "order_one", expectedAmount: 1000, expectedCurrency: "INR" });
    expect(response.status).toBe(200); expect(fetchPayments).toHaveBeenCalledWith("order_one");
  });
  it("reports missing server payment keys", async () => {
    vi.stubEnv("RAZORPAY_SECRET_KEY", "");
    expect((await request(proof())).status).toBe(503);
  });
});
