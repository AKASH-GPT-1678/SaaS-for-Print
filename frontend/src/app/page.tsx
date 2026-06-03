"use client";
import { useAppSelector } from "@/lib/hooks";
import BeigeBack from "../../public/seige_back.png";
import Header from "./landing/Header";
import MidSection from "./landing/MidSection";
import DashBoard from "./dashboard/page";
export default function Home() {
  const token = useAppSelector((state) => state.data.token);
  return (
    <DashBoard />

  );
}
