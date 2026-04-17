"use client";
import { useAppSelector } from "@/lib/hooks";
import CheckoutButton from "./components/CheckoutButton";
export default function Home() {
  const token = useAppSelector((state)=> state.data.token); 
  return (
 <div>

  <h1>Hello Namaste</h1>
  <CheckoutButton />
 </div>
  );
}
