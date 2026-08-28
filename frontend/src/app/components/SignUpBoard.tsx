import React from "react";
import { FaRegUser } from "react-icons/fa";
import { Button} from "@mui/material";
import { BiMessageDetail } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import CustomInput from "@/lib/Input";
import SocialMedia from "@/lib/socials";
import { api, getApiErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
const SignUpBoard = () => {
  const [username, setUsername] = React.useState("");
  const [email , setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordType , setPasswordType] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const registerUser = async () => {
    if (!username || !password || !email) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        email,
        username,
        password,
      });

      if (response.data.success) {
        router.push("/login");
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="w-full min-h-screen flex items-center justify-center p-4">

    {/* Outer Box */}
    <div className="flex flex-col md:flex-row border-2 w-full md:w-[60%] min-h-[80vh] rounded-xl overflow-hidden">

      {/* LEFT SIDE */}
      <div className="flex flex-col items-center justify-center w-full md:w-[50%] px-6 md:px-10 py-10">

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
              onChange={(e) => setUsername(e.target.value)}
            />

            <CustomInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              icon={BiMessageDetail}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex flex-col mt-2">
              <label className="text-gray-400">Password</label>

              <div className="flex justify-between items-center">
                <input
                  type={passwordType ? "password" : "text"}
                  placeholder="Enter your password (min 8 characters)"
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

          {/* Terms */}
          <div className="flex gap-2 mt-6 items-center">
            <input type="radio" className="accent-blue-700" />
            <p className="text-sm font-semibold">
              I agree to the terms and conditions
            </p>
          </div>

          {error ? (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          ) : null}

          {/* Buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <Button
              variant="contained"
              className="p-2 bg-blue-500 w-full text-white"
              onClick={registerUser}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <Button
              variant="outlined"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>

          {/* Social */}
          <SocialMedia />

        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div
        className="hidden md:block w-full md:w-[50%] min-h-[300px] md:min-h-full"
        style={{
          backgroundImage: "url('/table.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  </div>
);
};

export default SignUpBoard;
