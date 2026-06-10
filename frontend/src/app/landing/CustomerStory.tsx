import React from "react";
import { IoPlayForward } from "react-icons/io5";
import { IoArrowForwardSharp } from "react-icons/io5";
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
        <div className="h-60 w-60  bg-blue-500 rounded-2xl"></div>
        <div className="flex flex-col gap-5">
          <p className="text-white max-w-60 md:max-w-80 text-xl md:text-2xl font-bold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
