import Image from "next/image";
import Logo from "../../../public/logo_bgg.png";
import CheckoutButton from "../components/CheckoutButton";
import Link from "next/link";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src={Logo.src}
          alt="brand-logo"
          width={30}
          height={30}
          className="bg-black"
        />

        <p className="text-xl md:text-2xl font-bold">
          Printar
        </p>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        <Link href="/dashboard" className="font-bold hover:text-gray-600">
          Product
        </Link>

        <Link href="#" className="font-bold hover:text-gray-600">
          Use Cases
        </Link>

        <Link href="#" className="font-bold hover:text-gray-600">
          Customers
        </Link>

        <Link href="#" className="font-bold hover:text-gray-600">
          Blog
        </Link>

        <Link href="#" className="font-bold hover:text-gray-600">
          Company
        </Link>

        <Link href="#" className="font-bold hover:text-gray-600">
          Pricing
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Hide button on very small screens */}
        <div className="hidden sm:block">
          <CheckoutButton />
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden">
          <Menu size={30} />
        </button>
      </div>
    </nav>
  );
};

export default Header;