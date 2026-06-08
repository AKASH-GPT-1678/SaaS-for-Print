import React from "react";
import Image from "next/image";
import Square from "../../../public/square.png";
import { IoArrowForwardSharp } from "react-icons/io5";
const ProductPage = () => {
  return (
    <div className="px-20">
      <div className="bg-black w-full h-1 mt-10 mb-4 px-10"></div>

      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="bg-black h-4 w-4"></div>
        <p>Product</p>
      </div>

      <div>
        <p className="text-3xl font-bold mb-4">
          AI engineered to transform customer service
        </p>
        <p className=" max-w-100">
          No tradeoffs between customer experience,compliance and orperational
          efficiency -- you get all three
        </p>
      </div>

      <div className="flex flex-col items-center gap-20">
        <div className="w-full flex justify-center gap-20">
          <div className="">
            <p className="text-4xl font-bold">SuperHuman </p>
            <p className="text-4xl font-bold">Performance at scale</p>
            <p className="max-w-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div>
            <Image
              src={Square.src}
              alt="square"
              width={200}
              height={200}
              className="rounded-2xl"
            />
          </div>
        </div>

        <div className="w-full flex justify-center gap-20">
          <div>
            <Image
              src={Square.src}
              alt="square"
              width={200}
              height={200}
              className="rounded-2xl"
            />
          </div>
          <div className="">
            <p className="text-4xl font-bold">SuperHuman </p>
            <p className="text-4xl font-bold">Performance at scale</p>
            <p className="max-w-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center gap-20">
          <div className="">
            <p className="text-4xl font-bold">SuperHuman </p>
            <p className="text-4xl font-bold">Performance at scale</p>
            <p className="max-w-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div>
            <Image
              src={Square.src}
              alt="square"
              width={200}
              height={200}
              className="rounded-2xl"
            />
          </div>
        </div>
        <button className="flex items-center gap-3 bg-black px-8 py-4 rounded-full text-white font-semibold hover:scale-105 transition w-fit">
          See it in action
          <IoArrowForwardSharp size={20} />
        </button>

        <div></div>
      </div>
    </div>
  );
};

export default ProductPage;
