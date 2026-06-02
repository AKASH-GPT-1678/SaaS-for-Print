import React from "react";
import { IoArrowForwardSharp } from "react-icons/io5";
const MidSection = () => {
  return (
    <section className="flex flex-col items-center text-center gap-8 px-6 py-20">
      {/* Badge */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
        <p className="text-lg italic font-medium">
          Scale your print business
        </p>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          The only product you need
        </h1>

        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          For Your Printout Chores
        </h1>
      </div>

      {/* Description */}
      <p className="max-w-3xl text-gray-600 text-lg">
        Empowering print shops across India with smarter workflows,
        seamless order management, customer tracking, billing,
        inventory management, and the tools needed to run and grow
        a modern printing business.
      </p>

      {/* CTA */}
      <button className="flex items-center gap-3 bg-orange-500 px-8 py-4 rounded-full text-white font-semibold hover:scale-105 transition">
        See it in action
        <IoArrowForwardSharp size={20} />
      </button>
    </section>
  );
};

export default MidSection;