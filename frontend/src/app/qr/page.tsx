"use client";
import axios from 'axios';
import React from 'react'
const QRCodePage = () => {

    const [qrCode, setQrCode] = React.useState(false);
    const [qrCodeUrl, setQrCodeUrl] = React.useState(""); 
     const generateQRCode = async () => {
    const url = "https://theakashgupta.com/";

    try {
      const response = await axios.get(
        "http://localhost:8080/qr/generate",
        {
          params: { url },
          responseType: "blob", // IMPORTANT for image
        }
      );
      if(response.status === 200 && response.data !== null){
        setQrCode(true);
      }

      const imageUrl = URL.createObjectURL(response.data);
      setQrCodeUrl(imageUrl);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-lg">
        
        <h2 className="text-2xl font-semibold">QR Code Generator</h2>

        <img 
          src={qrCode ? qrCodeUrl : "infosys.jpeg"} 
          alt="QR Code" 
          className="w-[250px] h-[250px] object-cover rounded-lg border"
        />

        <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition" onClick={generateQRCode}>
          Generate QR Code
        </button>

      </div>

    </div>
  )
}

export default QRCodePage;