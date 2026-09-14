import Image from "next/image";
import Logo from "../../../public/logo_bgg.png";
import CheckoutButton from "../components/CheckoutButton";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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

        <p className="text-xl md:text-2xl font-bold">Printar</p>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        <Link href="#product" className="font-bold hover:text-gray-600">
          Product
        </Link>

        <Link href="#use-cases" className="font-bold hover:text-gray-600">
          Use Cases
        </Link>

        <Link href="#customers" className="font-bold hover:text-gray-600">
          Customers
        </Link>

        <Link href="#insights" className="font-bold hover:text-gray-600">
          Blog
        </Link>

        <Link href="#company" className="font-bold hover:text-gray-600">
          Company
        </Link>

        <Link href="#pricing" className="font-bold hover:text-gray-600">
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
        <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} className="lg:hidden" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl border border-black/10 bg-white p-4 shadow-xl lg:hidden">
          {[["Product", "#product"], ["Use cases", "#use-cases"], ["Customers", "#customers"], ["Insights", "#insights"], ["Pricing", "#pricing"]].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 font-semibold hover:bg-amber-50">
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
