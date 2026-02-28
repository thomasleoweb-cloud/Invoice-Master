import { Link } from "react-router";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const Menu = [
    {
      name: "Home",
      path: "",
    },
    {
      name: "Invoice",
      path: "/invoice",
    },
    {
      name: "Download",
      path: "/download",
    },
  ];
  return (
    <div className="Header flex flex-col justify-center items-center h-full relative">
      <nav className="NavBar flex justify-between w-11/12 md:w-10/12 py-4">
        <div
          className="BurgerBox flex items-center justify-center md:hidden cursor-pointer text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i class="fa-solid fa-bars"></i>
        </div>
        <h1 className="Logo print:hidden font-bold text-white text-2xl md:text-4xl">
          <span className="font-extrabold text-blue-950 print:hidden">I</span>
          nvoice{" "}
          <span className="font-extrabold text-blue-950 print:hidden">M</span>
          aster
        </h1>
        <div className="navLinksBox hidden md:block">
          <ul className="ulNav flex gap-5 font-medium text-xl h-full px-5 lg:gap-20">
            {Menu?.map((item) => (
              <li
                key={item?.name}
                className="liNav cursor-pointer hover:underline mt-2.5"
              >
                <Link to={item?.path}>{item?.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden w-full bg-blue-500 shadow-lg absolute top-full left-0 z-50`}
      >
        <ul className="flex flex-col items-center py-4 gap-4 font-medium text-lg text-white">
          {Menu?.map((item) => (
            <li
              key={item?.name}
              className="w-full text-center border-b border-blue-400 pb-2 last:border-none"
            >
              <Link
                to={item?.path}
                onClick={() => setIsOpen(false)}
                className="block w-full h-full"
              >
                {item?.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
