import Image from "next/image";
import Square from "../../../public/square.png";
import { IoArrowForwardSharp } from "react-icons/io5";
import AI from "../../../public/ai.png";
const ProductPage = () => {
  return (
    <section id="product" className="px-6 py-20 md:px-20 md:py-28">
      <div className="bg-black w-full h-1 mt-10 mb-4 px-10"></div>

      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="bg-black h-4 w-4"></div>
        <p>Product</p>
      </div>

      <div className="mb-8">
        <p className=" text-2xl md:text-3xl font-bold mb-4">
          Everything your counter team needs to move faster
        </p>
        <p className=" max-w-100">
          Printar turns a scattered print request into a simple, trackable flow
          your team can repeat every day.
        </p>
      </div>

      <div className="flex flex-col items-center gap-20">
        {/* Section 1 */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6">
          <div className="max-w-md text-center lg:text-left space-y-3">
            <p className="text-3xl font-bold lg:text-4xl">A faster front desk</p>

            <p className="text-gray-600">
              Replace long message threads and USB drives with a QR code that
              lets customers send print-ready documents before they reach the
              counter.
            </p>
          </div>

          <Image
            src={AI.src}
            alt="square"
            width={200}
            height={200}
            className="rounded-2xl"
          />
        </div>

        {/* Section 2 */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6">
          <Image
            src={Square.src}
            alt="square"
            width={200}
            height={200}
            className="rounded-2xl"
          />

          <div className="max-w-md text-center lg:text-left space-y-3">
            <p className="text-3xl font-bold lg:text-4xl">Never miss a request</p>

            <p className="text-gray-600">
              Live notifications keep your team aware of new files as they
              arrive, so customers spend less time asking whether their job
              was received.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-6">
          <div className="max-w-md text-center lg:text-left space-y-3">
            <p className="text-3xl font-bold lg:text-4xl">Built for everyday work</p>

            <p className="text-gray-600">
              Keep customer files together, find what you need quickly, and
              give your shop a workflow that feels professional from day one.
            </p>
          </div>

          <Image
            src={Square.src}
            alt="square"
            width={200}
            height={200}
            className="rounded-2xl"
          />
        </div>

        <button type="button" className="flex items-center gap-3 mb-4 bg-black px-8 py-4 rounded-full text-white font-semibold hover:scale-105 transition">
          See it in action
          <IoArrowForwardSharp size={20} />
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
