"use client";
import { useAppSelector } from "@/lib/hooks";
import BeigeBack from "../../../public/seige_back.png";
import Header from "../landing/Header";
import MidSection from "../landing/MidSection";
import TrustedCompanies from "../landing/trusted";
const DashBoard = () => {
  const token = useAppSelector((state) => state.data.token);
  return (
<div>
  {/* Hero Section */}
  <div className="bg-amber-50 w-full min-h-screen">
    <Header />

    <div className="flex items-center justify-center">
      <MidSection />
    </div>

    <div
      className="h-100 w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${BeigeBack.src})`,
      }}
    />
  </div>

  {/* Trusted Companies Section */}
  <TrustedCompanies />
</div>
  );
}


export default DashBoard;