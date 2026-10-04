"use client";
import BeigeBack from "../../../public/seige_back.png";
import Header from "../landing/Header";
import MidSection from "../landing/MidSection";
import TrustedCompanies from "../landing/trusted";
import ProductPage from "../landing/Product";
import CustomerStory from "../landing/CustomerStory";
import SecuritySection from "../landing/SecuritySection";
import BlogSection from "../landing/BlogSection";
import FooterCTA from "../landing/FooterCTA";
const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-amber-50 w-full min-h-screen">
        <Header />

        <MidSection />

        <div
            className="h-72 w-full bg-cover bg-center bg-no-repeat md:h-96"
          style={{
            backgroundImage: `url(${BeigeBack.src})`,
          }}
        />
      </div>

      {/* Trusted Companies Section */}
      <TrustedCompanies />
      <ProductPage />
      <CustomerStory />
      <SecuritySection />
      <BlogSection />
      <FooterCTA />
    </div>
  );
};

export default LandingPage;
