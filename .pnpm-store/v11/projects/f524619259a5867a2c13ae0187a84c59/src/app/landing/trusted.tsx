const TrustedCompanies = () => {
  return (
    <section id="use-cases" className="w-full bg-black px-6 py-16 md:px-20 md:py-20">
      <div>
        {/* White line */}
        <div className="w-full h-px bg-white mb-6"></div>

        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 md:h-5 md:w-5 bg-white"></div>

          <p className="text-white text-base md:text-lg font-medium">
            Trusted by Major Indian Organizations
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 py-10 sm:grid-cols-3 lg:grid-cols-5">
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
        ].map((company) => (
          <div
            key={company}
            className="
              h-20 w-full
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
    </section>
  );
};

export default TrustedCompanies;
