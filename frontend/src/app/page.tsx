"use client";
import { useAppSelector } from "@/lib/hooks";
import LandingPage from "./landing/landingpage";
import { NewLandingPage } from "@/components/landing/page";

export default function Home() {
  const token = useAppSelector((state) => state.data.token);
  return (
    <NewLandingPage />
  


  );
}
