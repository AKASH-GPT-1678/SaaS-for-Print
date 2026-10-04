import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { IoQrCodeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { LuShoppingBag } from "react-icons/lu";
import { HiOutlineCalculator } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { FaClockRotateLeft } from "react-icons/fa6";

const SideBar = () => {
  const router = useRouter();
  return (
    <div className="h-screen" >
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
            <div className="p-2 mb-2 cursor-pointer">
              <AiOutlineClockCircle className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/qr")}
            >
              <IoQrCodeOutline className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/qr")}
            >
              <LuShoppingBag className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <HiOutlineCalculator className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <LuUsers className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <LuUsers className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/schedule")}
            >
              <FaClockRotateLeft className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <LuUsers className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <LuUsers className="h-8 w-8" />
            </div>

            <div
              className="p-2 mb-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <LuUsers className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
