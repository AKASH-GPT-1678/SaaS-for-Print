import React from "react";
import { FaRegUser } from "react-icons/fa";
import { Button, TextField } from "@mui/material";
import { BiMessageDetail } from "react-icons/bi";
import { FaLock } from "react-icons/fa";

const SignUpBoard = () => {
  return (
    <div>
      <div className="flex  justify-center">
        <div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome to our CRM </h1>
            <h1 className="text-2xl font-semibold">
              SignUp for getting started
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Enter your details to proceed further
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2 mt-1">
              <TextField
                id="standard-basic"
                label="Full Name"
                variant="standard"
                className="w-sm"
              />
              <FaRegUser size={18} />
            </div>
            <div className="flex flex-row items-center gap-2 mt-1">
              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                className="w-sm"
              />
              <BiMessageDetail size={18} />
            </div>
            <div className="flex flex-row items-center gap-2 mt-1">
              <TextField
                id="standard-basic"
                label="Password"
                variant="standard"
                className="w-sm"
              />
              <FaLock size={18} />
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-6">
            <input type="radio" className="scale-140" />
            <p className="text-sm font-bold font-serif">I agree to the terms and conditions</p>
          </div>
          <div>
            <Button className="p-2 bg-blue-400">Sign Up</Button>
            <Button>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpBoard;
