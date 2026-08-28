"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppSelector } from "@/lib/hooks";

const QRCodePage = () => {
  const token = useAppSelector((state) => state.data.token);
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const objectUrlRef = React.useRef<string>("");

  const generateQr = React.useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/qr/generate", {
        responseType: "blob",
      });
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const nextUrl = URL.createObjectURL(response.data);
      objectUrlRef.current = nextUrl;
      setQrCodeUrl(nextUrl);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Could not generate QR code"));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    void generateQr();
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [token, router, generateQr]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Upload QR</h1>
        <p className="mt-2 text-sm text-slate-600">
          Customers scan this code to send documents to your shop.
        </p>

        <div className="mt-6 flex min-h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          {loading ? (
            <p className="text-sm text-slate-500">Generating QR code...</p>
          ) : qrCodeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrCodeUrl} alt="Shop upload QR code" className="h-64 w-64" />
          ) : (
            <p className="text-sm text-slate-500">No QR code yet</p>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={() => void generateQr()}
          disabled={loading || !token}
          className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Regenerate QR"}
        </button>
      </section>
    </main>
  );
};

export default QRCodePage;
