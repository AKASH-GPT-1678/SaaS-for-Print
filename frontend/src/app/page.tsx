"use client";
import { useAppSelector } from "@/lib/hooks";
import CheckoutButton from "./components/CheckoutButton";
import DashBoard from "./dashboard/page";
export default function Home() {
  const token = useAppSelector((state)=> state.data.token); 
  return (
 <div>

 <DashBoard />
 </div>
  );
}
