import Image from "next/image";
import Logo from "../../../public/logo_bgg.png";
const Header = () => {
  const links = [
    "Product",
    "Use Cases",
    "Customers",
    "Blog",
    "Company",
    "Pricing",
  ];
  return (
    <nav className="flex items-center justify-between px-10 py-4 ">
      <div className="flex gap-2">
        <Image
          src={Logo.src}
          alt="brand-logo"
          width={30}
          height={30}
          className="bg-black"
        />
        <p className="text-2xl font-bold">Printar</p>
      </div>

      <div className="flex flex-row gap-4"></div>

      <div className="flex items-center gap-10">
        {links.map((link) => (
          <a key={link} href="#" className="font-bold">
            {link}
          </a>
        ))}
      </div>

      <button className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white font-medium">
        Request a demo
        <span>→</span>
      </button>
    </nav>
  );
};

export default Header;
