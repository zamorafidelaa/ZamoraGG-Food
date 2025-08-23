import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Utensils,
  ShoppingCart,
  ClipboardList,
  Info,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole"); // "CUSTOMER" kalau login
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (!role) return;
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="font-extrabold text-2xl tracking-wide text-blue-600">
        <Link to="/" className="hover:text-blue-800 transition">
          ZamoraGG <span className="text-blue-400">Food</span>
        </Link>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center gap-6 text-gray-700">
        {role === "CUSTOMER" && (
          <>
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <Home size={20} /> <span className="text-sm font-medium">Home</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <Info size={20} /> <span className="text-sm font-medium">About</span>
            </Link>
            <Link
              to="/menu"
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <Utensils size={20} /> <span className="text-sm font-medium">Menu</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <ClipboardList size={20} />{" "}
              <span className="text-sm font-medium">Orders</span>
            </Link>
            <Link
              to="/cart"
              className="hover:text-blue-500 transition relative"
            >
              <ShoppingCart size={22} />
            </Link>
          </>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={!role}
          className={`p-2 rounded-full shadow-md transition 
            ${
              role
                ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <LogOut size={20} />
        </button>
      </nav>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <MenuIcon size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-md py-4 flex flex-col gap-4 px-6 md:hidden">
          {role === "CUSTOMER" && (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <Home size={20} /> Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <Info size={20} /> About
              </Link>
              <Link
                to="/menu"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <Utensils size={20} /> Menu
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <ClipboardList size={20} /> Orders
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <ShoppingCart size={20} /> Cart
              </Link>
            </>
          )}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            disabled={!role}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition w-fit
              ${
                role
                  ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
