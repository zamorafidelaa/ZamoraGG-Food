import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Utensils,
  ClipboardList,
  Info,
  LogOut,
  Menu as MenuIcon,
  X,
  LogIn,
  ShoppingCart,
  User,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchCartCount = async () => {
    if (!userId || role !== "CUSTOMER") {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/cart/${userId}`);
      const data = await res.json();
      const totalQty = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();

    const handleStorage = () => {
      setRole(localStorage.getItem("userRole"));
      fetchCartCount();
    };
    window.addEventListener("storage", handleStorage);

    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [userId, role]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setRole(null);
    setCartCount(0);
    setIsOpen(false);
    setProfileMenuOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  const linkClass = (path) => {
    return `relative flex items-center gap-1 px-3 py-1 rounded-lg transition-colors duration-200 
     ${
       activeLink === path
         ? "text-blue-600"
         : "text-gray-700 hover:text-blue-600"
     }
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] 
     after:bg-blue-600 after:transition-all after:duration-300 
     ${activeLink === path ? "after:w-full" : "hover:after:w-full"}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm px-6 py-3 flex items-center justify-between">
{/* Logo */}
<div className="flex items-center font-extrabold text-blue-600">
  <img
    src="/ggfood.png"
    alt="ZamoraGG Logo"
    className="w-6 h-6 sm:w-7 sm:h-7 mr-1 sm:mr-2"
  />
<Link
  to="/"
  onClick={() => setActiveLink("/")}
  className="text-base sm:text-lg md:text-2xl whitespace-nowrap"
>
  ZamoraGG <span className="text-blue-400">Food</span>
</Link>
</div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-4 mx-auto">
        {role === "CUSTOMER" && (
          <>
            <Link
              to="/"
              onClick={() => setActiveLink("/")}
              className={linkClass("/")}
            >
              <Home size={18} /> Home
            </Link>
            <Link
              to="/about"
              onClick={() => setActiveLink("/about")}
              className={linkClass("/about")}
            >
              <Info size={18} /> About
            </Link>
            <Link
              to="/menu"
              onClick={() => setActiveLink("/menu")}
              className={linkClass("/menu")}
            >
              <Utensils size={18} /> Menu
            </Link>
          </>
        )}
      </nav>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-3 relative">
        {role === "CUSTOMER" && (
          <>
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                <User size={20} />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <ClipboardList size={16} /> History Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {!role && (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <LogIn size={16} /> Login
          </button>
        )}
      </div>

      {/* Mobile Right (Cart + Profile + Hamburger) */}
      <div className="md:hidden flex items-center gap-2">
        {role === "CUSTOMER" && (
          <>
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <ShoppingCart size={15} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              <User size={15} />
            </button>
          </>
        )}

        {/* Hamburger */}
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-md py-4 flex flex-col gap-2 px-6 md:hidden">
          {role === "CUSTOMER" && (
            <>
              <Link
                to="/"
                onClick={() => {
                  setActiveLink("/");
                  setIsOpen(false);
                }}
                className={linkClass("/")}
              >
                <Home size={18} /> Home
              </Link>
              <Link
                to="/about"
                onClick={() => {
                  setActiveLink("/about");
                  setIsOpen(false);
                }}
                className={linkClass("/about")}
              >
                <Info size={18} /> About
              </Link>
              <Link
                to="/menu"
                onClick={() => {
                  setActiveLink("/menu");
                  setIsOpen(false);
                }}
                className={linkClass("/menu")}
              >
                <Utensils size={18} /> Menu
              </Link>
            </>
          )}

          {!role && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
            >
              <LogIn size={16} /> Login
            </button>
          )}
          {role && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
