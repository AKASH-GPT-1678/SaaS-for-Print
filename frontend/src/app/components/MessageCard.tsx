import Image from "next/image";
import Profile from "../../../public/profile.png"
export default function MessageCard() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-gray-50 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={Profile.src}
            alt="profile"
            width={50}
            height={50}
            className="rounded-xl object-cover"
          />

          {/* Online Indicator */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400"></span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Nicholas Gordon
            </h3>

            <span className="text-sm text-indigo-400">
              10m
            </span>
          </div>

          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            Moreover the striking, brilliant and vivid colors
          </p>
        </div>
      </div>
    </div>
  );
}