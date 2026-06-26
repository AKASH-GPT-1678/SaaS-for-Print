import React from "react";
import { IoPlayForward } from "react-icons/io5";
import { IoArrowForwardSharp } from "react-icons/io5";
import KrishnaPandey from "../../../public/krishna.png";
import Image from "next/image";
const CustomerStory = () => {
  return (
    <div className="bg-black w-full min-h-80 pt-20 pb-20">
      <div className="px-20">
        {/* White line */}
        <div className="w-full h-[1px] bg-white mb-6"></div>

        {/* Content */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-white"></div>
          <p className="text-white">Customer Story</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-16 mt-10">
        <div className="h-64 w-60  bg-blue-500 rounded-2xl px-5">
          <span className="font-extrabold text-4xl">“</span>
          <div>
            <p className="font-bold text-xl">
              After adapting Printar my work got 70% efficient and time
              consumption way lesser{" "}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Image
              src={KrishnaPandey.src}
              width={40}
              height={40}
              alt="print-owner"
              className="rounded-full object-cover border border-gray-300"
            />

            <div>
              <p className="text-lg font-semibold text-black">Krishna Pandey</p>
              <p className="text-sm text-black">Local Shop Owner</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
<p className="text-white max-w-60 md:max-w-80 text-xl md:text-2xl font-bold">
  Every print request is processed with speed, privacy, and simplicity—making
  document printing effortless for customers and shop owners alike.
</p>
          <button className="flex items-center gap-3 bg-white px-6 py-3 rounded-full text-black font-semibold hover:scale-105 transition w-fit">
            See it in action
            <IoArrowForwardSharp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerStory;
