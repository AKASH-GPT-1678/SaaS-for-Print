import React from "react";
import { FaRegUser } from "react-icons/fa";
import { Button} from "@mui/material";
import { BiMessageDetail } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import CustomInput from "@/lib/Input";
import SocialMedia from "@/lib/socials";
import axios from "axios";
import { useRouter } from "next/navigation";
const SignUpBoard = () => {
  const [username, setUsername] = React.useState("");
  const [email , setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordType , setPasswordType] = React.useState(true);
  const router = useRouter();
  const registerUser = async () => {
    if (username && password) {
        try {
            const response = await axios.post('http://localhost:8080/register', {
              email,
                username,
                password
            });

            console.log(response.data);
            if(response.data.success){
                router.push('/login');
            }
        } catch (error : any) {
            console.error(error.response?.data || error.message);
        }
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      
      {/* Outer Box */}
      <div className="flex flex-row border-2 w-[60%] h-[80%] rounded-xl">
        
        {/* LEFT SIDE (50%) */}
        <div className="flex flex-col items-center justify-center w-[50%] px-10">
          
          <div className="w-full max-w-md">
            
            {/* Heading */}
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome to our CRM
              </h1>
              <h1 className="text-2xl font-semibold">
                SignUp for getting started
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Enter your details to proceed further
              </p>
            </div>

            {/* Inputs */}
            <div className="mt-10 flex flex-col gap-4">
              <CustomInput
                label="Full Name"
                placeholder="Enter your name"
                type="text"
                icon={FaRegUser}
                onChange={(e)=> setUsername(e.target.value)}
                
              />

              <CustomInput
                label="Email"
                placeholder="Enter your email"
                type="email"
                icon={BiMessageDetail}
                onChange={(e)=> setEmail(e.target.value)}
              />

                <div className="flex flex-col mt-2">
      <label htmlFor="input" className="text-gray-400">
        Password
        
      </label>

      <div className="flex flex-row justify-between items-center">
        <input
          type={passwordType ? "password" : "text"}
          id="input"
          placeholder={"Enter your password"}
          className="outline-none"
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

            {/* Terms */}
            <div className="flex flex-row gap-2 mt-6 items-center">
              <input type="radio" className="scale-125 accent-blue-700" />
              <p className="text-sm font-semibold">
                I agree to the terms and conditions
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-row gap-4">
              <Button
                variant="contained"
                className="p-2 bg-blue-500 w-full text-white"
                onClick={registerUser}
              >
                Sign Up
              </Button>
              <Button variant="outlined" className="w-full" onClick={()=>router.push("/login")}>
                Sign In
              </Button>
            </div>

            {/* Social */}
            <SocialMedia />

          </div>
        </div>

        {/* RIGHT SIDE (50% IMAGE PANEL) */}
        <div
          className="w-[50%] h-full hidden md:block rounded-2xl"
          style={{
            backgroundImage: "url('/table.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

      </div>
    </div>
  );
};

export default SignUpBoard;
