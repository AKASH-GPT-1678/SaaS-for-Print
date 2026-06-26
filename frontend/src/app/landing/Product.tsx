import React from "react";
import Image from "next/image";
import Square from "../../../public/square.png";
import { IoArrowForwardSharp } from "react-icons/io5";
import AI from "../../../public/ai.png"
const ProductPage = () => {
  return (
    <div className="px-6 md:px-20">
      <div className="bg-black w-full h-1 mt-10 mb-4 px-10"></div>

      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="bg-black h-4 w-4"></div>
        <p>Product</p>
      </div>

      <div className="mb-8">
        <p className=" text-2xl md:text-3xl font-bold mb-4">
          AI engineered to transform customer service
        </p>
        <p className=" max-w-100">
          No tradeoffs between customer experience,compliance and orperational
          efficiency -- you get all three
        </p>
      </div>

      <div className="flex flex-col items-center gap-20">
        {/* Section 1 */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6">
          <div className="max-w-md text-center lg:text-left space-y-3">
            <p className="text-3xl lg:text-4xl font-bold">SuperHuman</p>
            <p className="text-3xl lg:text-4xl font-bold">
              Performance at Scale
            </p>

            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
          </div>

          <Image
            src={AI.src}
            alt="square"
            width={200}
            height={200}
            className="rounded-2xl"
          />
        </div>

        {/* Section 2 */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6">
          <Image
            src={Square.src}
            alt="square"
            width={200}
            height={200}
            className="rounded-2xl"
          />

          <div className="max-w-md text-center lg:text-left space-y-3">
            <p className="text-3xl lg:text-4xl font-bold">SuperHuman</p>
            <p className="text-3xl lg:text-4xl font-bold">
              Performance at Scale
            </p>

            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6">
          <div className="max-w-md text-center lg:text-left space-y-3">
            <p className="text-3xl lg:text-4xl font-bold">SuperHuman</p>
            <p className="text-3xl lg:text-4xl font-bold">
              Performance at Scale
            </p>

            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
          </div>

          <Image
            src={Square.src}
            alt="square"
            width={200}
            height={200}
            className="rounded-2xl"
          />
        </div>

        <button className="flex items-center gap-3 mb-4 bg-black px-8 py-4 rounded-full text-white font-semibold hover:scale-105 transition">
          See it in action
          <IoArrowForwardSharp size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
