"use client";
import { FaRegUser, FaLock } from "react-icons/fa";
import CustomInput from "@/lib/Input";
import React from "react";
import SocialMedia from "@/lib/socials";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { setToken } from "../redux/redux-setup";
import { useRouter } from "next/navigation";
const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordType, setPasswordType] = React.useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loginUser = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.token != null) {
        dispatch(setToken(response.data.token));
        router.push("/");
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
    }
  };

return (
  <div className="w-full min-h-screen flex items-center justify-center">
    <div className="flex flex-col md:flex-row border-2 w-[95%] md:w-[60%] h-auto md:h-[80%]">

      {/* LEFT SIDE (FORM) */}
      <div className="flex flex-col items-center justify-center w-full md:w-[60%] p-4">
        <div className="flex flex-col w-full max-w-md">

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold">Welcome back 👋</h2>
            <h2 className="text-3xl font-bold">Sign in to your account</h2>
            <p className="font-semibold text-gray-400">
              Enter your details to proceed
            </p>
          </div>

          {/* Inputs */}
          <div className="mt-10 flex flex-col gap-6">
            <CustomInput
              label="Username"
              placeholder="Enter username"
              type="text"
              icon={FaRegUser}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="flex flex-col mt-2">
              <label className="text-gray-400">Password</label>

              <div className="flex flex-row justify-between items-center">
                <input
                  type={passwordType ? "password" : "text"}
                  placeholder="Enter your password"
                  className="outline-none w-full"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FaLock
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setPasswordType(!passwordType)}
                />
              </div>

              <hr className="mt-2" />
            </div>
          </div>

          {/* Remember + Recover */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <div className="flex items-center gap-2">
              <input type="radio" className="accent-blue-600" />
              <p>Remember me</p>
            </div>

            <p className="cursor-pointer text-blue-600 hover:underline">
              Recover Password
            </p>
          </div>

          {/* Button */}
          <button
            className="bg-blue-500 mt-6 text-white w-full p-2 rounded-lg cursor-pointer hover:bg-blue-600"
            onClick={loginUser}
          >
            Sign In
          </button>

          <SocialMedia />
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div
  className="hidden md:block w-full md:w-[40%] min-h-[500px]"
  style={{
    backgroundImage: "url('/bluebackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
/>
  
    </div>
  </div>
);
};

export default LoginPage;
