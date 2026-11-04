import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useQRCodes from "@/lib/use-qr-code";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: { post: vi.fn(), get: vi.fn() },
  getApiErrorMessage: (error: Error) => error.message,
}));
const order = {
  qrId: "qr-one",
  orderId: "order-one",
  keyId: "test-key",
  amount: 1000,
  currency: "INR",
};
const proof = {
  razorpay_order_id: "order-one",
  razorpay_payment_id: "pay-one",
  razorpay_signature: "signature",
};
let dismiss = false;
const opened = vi.fn();

beforeEach(() => {
  dismiss = false;
  vi.stubGlobal(
    "Razorpay",
    class {
      constructor(
        private options: {
          handler: (proof: unknown) => void;
          modal: { ondismiss: () => void };
        },
      ) {}
      open() {
        opened();
        if (dismiss) this.options.modal.ondismiss();
        else this.options.handler(proof);
      }
    },
  );
  vi.mocked(api.post).mockImplementation(async (url) => ({
    data: url === "/qr/orders" ? order : {},
  }));
});

describe("paid QR creation", () => {
  it("creates an order, verifies payment, then generates that specific QR", async () => {
    const { result } = renderHook(useQRCodes);
    await act(async () => {
      expect(await result.current.createQr("Front counter")).toBe(true);
    });
    expect(vi.mocked(api.post).mock.calls.map((call) => call[0])).toEqual([
      "/qr/orders",
      "/qr/qr-one/verify-payment",
      "/qr/qr-one/generate",
    ]);
    expect(api.post).toHaveBeenNthCalledWith(1, "/qr/orders", {
      name: "Front counter",
    });
    expect(api.post).toHaveBeenNthCalledWith(
      2,
      "/qr/qr-one/verify-payment",
      proof,
    );
    expect(result.current.busy).toBe(false);
  });

  it("does not generate when payment verification fails", async () => {
    vi.mocked(api.post).mockImplementation(async (url) => {
      if (url.includes("verify-payment"))
        throw new Error("Payment not captured");
      return { data: order };
    });
    const { result } = renderHook(useQRCodes);
    await act(async () => {
      expect(await result.current.createQr("Counter")).toBe(false);
    });
    expect(api.post).not.toHaveBeenCalledWith("/qr/qr-one/generate");
    expect(result.current.error).toBe("Payment not captured");
  });

  it("keeps the pending order when checkout is cancelled without generating", async () => {
    dismiss = true;
    const { result } = renderHook(useQRCodes);
    await act(async () => {
      await result.current.createQr("Counter");
    });
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(result.current.busy).toBe(false);
    expect(result.current.progress).toContain("Checkout closed");
  });

  it("retries a paid QR without opening checkout or creating another order", async () => {
    const { result } = renderHook(useQRCodes);
    await act(async () => {
      await result.current.retryGeneration("qr-one");
    });
    expect(vi.mocked(api.post).mock.calls.map((call) => call[0])).toEqual([
      "/qr/qr-one/verify-payment",
      "/qr/qr-one/generate",
    ]);
    expect(opened).not.toHaveBeenCalled();
  });

  it("reconciles a captured order before resuming so it does not charge again", async () => {
    const { result } = renderHook(useQRCodes);
    await act(async () => {
      await result.current.resumeCheckout("qr-one");
    });
    expect(opened).not.toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith("/qr/qr-one/generate");
    expect(api.get).not.toHaveBeenCalled();
  });

  it("fails before creating an order when the checkout script is unavailable", async () => {
    vi.stubGlobal("Razorpay", undefined);
    const { result } = renderHook(useQRCodes);
    await act(async () => {
      await result.current.createQr("Counter");
    });
    expect(api.post).not.toHaveBeenCalled();
    expect(result.current.error).toContain("still loading");
  });
});
