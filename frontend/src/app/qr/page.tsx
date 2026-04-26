"use client";
import axios from 'axios';
import React from 'react'
import GenerateQR from '../components/GenerateQR';
import { useAppSelector } from '@/lib/hooks';
const QRCodePage = () => {

    const [qrCode, setQrCode] = React.useState(false);
    const [qrCodeUrl, setQrCodeUrl] = React.useState(""); 
    const token = useAppSelector((state) => state.data.token);

  return (
    <div>
      <p>{token}</p>
      <GenerateQR />
    </div>

  )
}

export default QRCodePage;