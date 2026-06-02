"use client";
import { useAppSelector } from "@/lib/hooks";
import BeigeBack from "../../public/seige_back.png";
import Header from "./landing/Header";
import MidSection from "./landing/MidSection";
export default function Home() {
  const token = useAppSelector((state) => state.data.token);
  return (
    <div>
      <div className="bg-amber-50 pb-30  w-full h-screen">
        <Header />
        <div className="flex items-center justify-center">
          <MidSection />
        </div>
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${BeigeBack.src})`,
          }}
        ></div>
      </div>
    </div>
  );
}
