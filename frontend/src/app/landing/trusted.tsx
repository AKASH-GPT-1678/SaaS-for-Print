import React from "react";
import TCS from "../../../public/tcs.png";
import Image from "next/image";
const TrustedCompanies = () => {
  return (
    <div className="bg-black w-full min-h-80 pt-20">
      <div className="px-20">
        {/* White line */}
        <div className="w-full h-[1px] bg-white mb-6"></div>

        {/* Content */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-white"></div>
          <p className="text-white">Trusted by Major Indians</p>
        </div>
      </div>

      <div className="grid grid-cols-5 place-items-center gap-10 px-40">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center p-4">
            <Image
              src={TCS.src}
              alt="company-image"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default TrustedCompanies;
