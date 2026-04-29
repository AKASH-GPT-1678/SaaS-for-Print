"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { FaCartArrowDown } from "react-icons/fa";
import GenerateQR from "../components/GenerateQR";
const DashBoard = () => {
  const router = useRouter();
  const [closeModal, setCloseModal] = React.useState(false);
  return (
    <div className="ml-4 mt-4">
      <div className="flex flex-row">
        <div className="w-[5%] h-screen bg-black"></div>
        <div className="flex flex-col p-2">
          <div>
            <img src="question.png" alt="images" className="h-24 w-24" />
            <p>Welcome</p>
            <p className=" text-2xl font-bold">SaasPrint</p>
          </div>
          <div className="mt-8">
            <p className="font-bold text-xl">Latest updates</p>
            <div className="flex flex-col gap-3 pl-4 mt-4">
              <div className="p-4 bg-gray-100 flex flex-row gap-4 items-center rounded-lg">
                <div className="p-2 bg-blue-200 w-fit rounded-lg">
                  <FaCartArrowDown size={20} className="" color="blue" />
                </div>
                <div>
                  <p></p>
                </div>
                <div>
                  <p className="font-bold cursor-pointer" onClick={()=>setCloseModal(!closeModal)}>New QR</p>
                </div>
              </div>
              <div className="p-4 bg-gray-100 flex flex-row gap-4 items-center rounded-lg">
                <div className="p-2 bg-blue-200 w-fit rounded-lg">
                  <FaCartArrowDown size={20} className="" color="blue" />
                </div>
                <div>
                  <p></p>
                </div>
                <div>
                 <p className="font-bold cursor-pointer">Transactions</p>
                </div>
              </div>
              <div className="p-4 bg-gray-100 flex flex-row gap-4 items-center rounded-lg">
                <div className="p-2 bg-blue-200 w-fit rounded-lg">
                  <FaCartArrowDown size={20} className="" color="blue" />
                </div>
                <div>
                  <p>Namaste</p>
                </div>
                <div>
                  <p>Namaste</p>
                </div>
              </div>
              <div className="p-4 bg-gray-100 flex flex-row gap-4 items-center rounded-lg">
                <div className="p-2 bg-blue-200 w-fit rounded-lg">
                  <FaCartArrowDown size={20} className="" color="blue" />
                </div>
                <div>
                  <p>Namaste</p>
                </div>
                <div>
                  <p>Namaste</p>
                </div>
              </div>
              <div className="p-4 bg-gray-100 flex flex-row gap-4 items-center rounded-lg">
                <div className="p-2 bg-blue-200 w-fit rounded-lg">
                  <FaCartArrowDown size={20} className="" color="blue" />
                </div>
                <div>
                  <p>Namaste</p>
                </div>
                <div>
                  <p>Namaste Ramakant</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h2 className="font-extrabold text-lg">Upcoming events</h2>
             <div  className="flex flex-col gap-2">

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-sm font-semibold text-blue-500">5:48 AM</p>
              <p className="font-bold mt-1">Meeting with client</p>
              <p className="text-gray-400 text-sm">My Name is narendra modi</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-sm font-semibold text-blue-500">5:48 AM</p>
              <p className="font-bold mt-1">Meeting with client</p>
              <p className="text-gray-400 text-sm">My Name is narendra modi</p>
            </div>
                 </div>
          </div>
        </div>
      </div>
      {closeModal && <GenerateQR closeModal={()=>setCloseModal(false)}/>}
    </div>
  );
};

export default DashBoard;
