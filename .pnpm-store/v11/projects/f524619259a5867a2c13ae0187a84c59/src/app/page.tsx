import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Printar — The whole counter, in one calmer place",
  description:
    "A clearer workspace for the documents, photo requests, and everyday jobs behind a busy print-shop counter.",
};

export default function Home() {
  return <LandingPage />;
}
