"use client";
import axios from "axios";
import React from "react";
import CheckoutButton from "./CheckoutButton";
import { useAppSelector } from "@/lib/hooks";
const GenerateQR = () => {
  const [qrCode, setQrCode] = React.useState(false);
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");
  const [numOFQR, setnumOFQR] = React.useState(0);
  const token = useAppSelector((state) => state.data.token);

  const collectQRTokens = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/qr/get_qr_tokens",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 && response.data) {
        setnumOFQR(response.data.qrTokens);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateQRCode = async () => {
    const url = "https://web.whatsapp.com/";

    try {
      const response = await axios.get("http://localhost:8080/qr/generate", {
        params: { url },
        responseType: "blob", // IMPORTANT for image
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data !== null) {
        setQrCode(true);
      }

      const imageUrl = URL.createObjectURL(response.data);
      setQrCodeUrl(imageUrl);
       if(numOFQR > 0){
        setnumOFQR(numOFQR -1)
       }
    } catch (error) {
      console.error(error);
    }
  };
  const QRCodeGenButton = () => {
    return (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={generateQRCode}
      >
        Generate QR Code
      </button>
    );
  };
  const downLoadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrCode.png";
    link.click();
  };

  React.useEffect(() => {
    collectQRTokens();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 relative">
        <h2 className="text-2xl font-semibold">
          Number of QR you can generate : {numOFQR}
        </h2>

        <img
          src={qrCode ? qrCodeUrl : "infosys.jpeg"}
          alt="QR Code"
          className="w-[250px] h-[250px] object-cover rounded-lg border"
        />

        {numOFQR > 0 ? <QRCodeGenButton /> : <CheckoutButton />}

        <button className="cursor-pointer bg-blue-500 p-2 px-4 text-white" onClick={downLoadQRCode}>
          Download QR Code
        </button>

        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl">
          ✕
        </button>
      </div>
    </div>
  );
};

export default GenerateQR;
