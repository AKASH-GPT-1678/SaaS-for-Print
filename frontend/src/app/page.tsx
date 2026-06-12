"use client";
import { useAppSelector } from "@/lib/hooks";
import LandingPage from "./landing/landingpage";

export default function Home() {
  const token = useAppSelector((state) => state.data.token);
  return (
    <LandingPage />
  


  );
}
