import React from "react";
import DashBoardWrapper from "../wrappers/dashboard-wrapper";
import Logo from "../../../public/logo_bgg.png";
import Image from "next/image";
import MessageCard from "../components/MessageCard";
const Page = () => {
  return (
    <DashBoardWrapper>
      <section className="ml-10">
        <Image src={Logo.src} alt="logo" width={100} height={100} />

        <div className="px-3">
          <p className="text-lg">Welcome</p>
          <p className="text-black font-bold md:text-2xl">CRAFT UI</p>
        </div>
        <div className="mt-5">
          <p className="font-bold text-lg">Messages</p>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <MessageCard key={index} />
            ))}
          </div>
        </div>
      </section>
    </DashBoardWrapper>
  );
};

export default Page;
