"use client";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { IoQrCodeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { LuShoppingBag } from "react-icons/lu";
import { HiOutlineCalculator } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { FaClockRotateLeft } from "react-icons/fa6";
const DashBoard = () => {
  const router = useRouter();
  return (
    <div>
      <div>
        <img
          src="favicon.ico"
          alt="logo"
          className="w-12 h-12"
          height={48}
          width={48}
        />
        <div>
          <div className="p-2 cursor-pointer">
            <AiOutlineClockCircle size={24} />
          </div>
          <div
            className="p-2 cursor-pointer"
            onClick={() => router.push("/qr")}
          >
            <IoQrCodeOutline size={24} />
          </div>
          <div
            className="p-2 cursor-pointer"
            onClick={() => router.push("/qr")}
          >
            <LuShoppingBag size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/")}>
            <HiOutlineCalculator size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/")}>
            <LuUsers size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/")}>
            <LuUsers size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/schedule")}>
            <FaClockRotateLeft size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/")}>
            <LuUsers size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/")}>
            <LuUsers size={24} />
          </div>
          <div className="p-2 cursor-pointer" onClick={() => router.push("/")}>
            <LuUsers size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
