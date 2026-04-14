import React from "react";
import { FaXTwitter, FaGoogle, FaFacebookF } from "react-icons/fa6";

const SocialMedia = () => {
  return (
    <div className="flex flex-col items-center mt-8">
      <p className="font-semibold text-gray-500">Or sign in with</p>
      <div className="flex flex-row gap-2 mt-2">
        <div className="border p-3 cursor-pointer">
          <FaXTwitter className="text-gray-400" />
        </div>

        <div className="border p-3 cursor-pointer">
          <FaGoogle className="text-gray-400" />
        </div>

        <div className="border p-3 cursor-pointer">
          <FaFacebookF className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
