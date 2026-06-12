import React from "react";
import { FaPeopleRoof } from "react-icons/fa6";
interface Props {
  children: React.ReactNode;
}
const DashBoardWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-5 md:p-10 flex h-screen w-screen bg-amber-100">
      <div className="flex flex-col gap-10">
        {Array.from({ length: 12 }).map((item, index) => (
          <div key={index}>
            <FaPeopleRoof className="text-2xl sm:text-3xl md:text-4xl cursor-pointer " />
          </div>
        ))}
      </div>

      {children}
    </div>
  );
};

export default DashBoardWrapper;
