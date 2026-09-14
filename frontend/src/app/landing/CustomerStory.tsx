import { IoArrowForwardSharp } from "react-icons/io5";
import KrishnaPandey from "../../../public/krishna.png";
import Image from "next/image";
const CustomerStory = () => {
  return (
    <section id="customers" className="w-full bg-black px-6 py-20 md:px-20 md:py-28">
      <div>
        {/* White line */}
        <div className="w-full h-[1px] bg-white mb-6"></div>

        {/* Content */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-white"></div>
          <p className="text-white">Customer Story</p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-stretch justify-center gap-12 md:flex-row md:items-center">
        <div className="rounded-3xl bg-blue-500 p-6 shadow-2xl shadow-blue-500/10 md:w-[360px]">
          <span className="font-extrabold text-4xl">“</span>
          <div>
            <p className="font-bold text-xl">
              After adopting Printar, our work became faster and the counter
              feels much more organized.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Image
              src={KrishnaPandey.src}
              width={40}
              height={40}
              alt="print-owner"
              className="rounded-full object-cover border border-gray-300"
            />

            <div>
              <p className="text-lg font-semibold text-black">Krishna Pandey</p>
              <p className="text-sm text-black">Local Shop Owner</p>
            </div>
          </div>
        </div>
        <div className="flex max-w-xl flex-col gap-5">
          <p className="text-white max-w-60 md:max-w-80 text-xl md:text-2xl font-bold">
            A better experience for the person sending the file—and the person
            printing it.
          </p>
          <button type="button" className="flex items-center gap-3 bg-white px-6 py-3 rounded-full text-black font-semibold hover:scale-105 transition w-fit">
            See it in action
            <IoArrowForwardSharp size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerStory;
