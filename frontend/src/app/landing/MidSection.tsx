import { IoArrowForwardSharp } from "react-icons/io5";
import Link from "next/link";
const MidSection = () => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 pb-16 pt-16 text-center md:pb-24 md:pt-24">
      {/* Badge */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
        <p className="text-lg italic font-medium">Scale your print business</p>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Your print shop,<br /><span className="text-orange-500">without the chaos.</span>
        </h1>

      </div>

      {/* Description */}
      <p className="max-w-3xl text-gray-600 text-lg">
        Give customers one simple way to send documents, then keep every job
        moving from upload to pickup in one calm, organized workspace.
      </p>

      {/* CTA */}
      <Link href="/register" className="flex items-center gap-3 rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600">
        See it in action
        <IoArrowForwardSharp size={20} />
      </Link>

      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
        {[["01", "Share one QR code", "Customers upload from their phone."], ["02", "Get files instantly", "New requests appear in real time."], ["03", "Print with confidence", "Less back-and-forth at the counter."]].map(([number, title, text]) => (
          <div key={number} className="rounded-2xl border border-black/10 bg-white/60 p-4 backdrop-blur-sm">
            <p className="text-xs font-bold text-orange-600">{number}</p>
            <p className="mt-3 font-bold">{title}</p>
            <p className="mt-1 text-sm text-zinc-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MidSection;
