import React from "react";

const TrustedCompanies = () => {
  return (
    <div className="bg-black w-full min-h-80 py-16 md:py-20">
      <div className="px-6 md:px-20">
        {/* White line */}
        <div className="w-full h-[1px] bg-white mb-6"></div>

        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 md:h-5 md:w-5 bg-white"></div>

          <p className="text-white text-base md:text-lg font-medium">
            Trusted by Major Indian Organizations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10 px-6 md:px-20 lg:px-40 py-12">
        {[
          "Government Offices",
          "Schools",
          "Colleges",
          "Hospitals",
          "Banks",
          "Print Shops",
          "Corporate Offices",
          "Coaching Institutes",
          "Libraries",
          "Startups",
          "Law Firms",
          "NGOs",
          "Hotels",
          "Coworking Spaces",
          "Small Businesses",
        ].map((company, index) => (
          <div
            key={index}
            className="
              w-full
              max-w-[180px]
              h-20
              mx-auto
              border
              border-white/20
              rounded-xl
              flex
              items-center
              justify-center
              hover:border-white/50
              transition-all
              duration-300
            "
          >
            <p className="text-white/80 text-center text-xs sm:text-sm font-medium px-3">
              {company}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedCompanies;
