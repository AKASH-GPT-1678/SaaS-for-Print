import SocialMedia from "@/lib/socials";
import React from "react";
import { FaRegMessage } from "react-icons/fa6";

const RecoverPassword = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-row border-2 w-[60%] h-[80%] ">
        <div className="flex flex-col items-center justify-center w-[60%]">
          <div className="flex flex-col ">
            <div>
              <h2 className="text-3xl font-bold">Lost your password ?</h2>
              <h2 className="text-3xl font-bold">
                Enter your details to recover
              </h2>
              <p className="font-semibold text-gray-400">
                Enter your details here to proceed{" "}
              </p>
            </div>
            <div className="flex flex-col mt-14">
              <label htmlFor="email" className="text-gray-400">
                Email
              </label>

              <div className="flex flex-row justify-between">
                <input
                  type="text"
                  id="email"
                  placeholder="Start typing..."
                  className="outline-hidden"
                />

                <FaRegMessage size={18} />
              </div>
              <hr className="mt-2" />
            </div>
            <div>
              <button className="bg-blue-500 mt-6 text-white w-full p-2 rounded-lg cursor-pointer">
                Recover
              </button>
              <SocialMedia />
            </div>
          </div>
        </div>
        <div
          className="w-[40%] h-full hidden md:block"
          style={{
            backgroundImage: "url('/recover_page.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default RecoverPassword;
