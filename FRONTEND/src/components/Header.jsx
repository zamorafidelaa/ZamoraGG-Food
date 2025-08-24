import React, { useState, useContext, useEffect } from "react";
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
  LogIn,
} from "lucide-react";
import { CartContext } from "../components/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const { cart, clearCart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);

  // update role saat login/logout
  useEffect(() => {
    const handleStorage = () => setRole(localStorage.getItem("userRole"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearCart();
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setRole(null);
    setIsOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="font-extrabold text-2xl text-blue-600">
        <Link to="/">
          ZamoraGG <span className="text-blue-400">Food</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-gray-700">
        {role === "CUSTOMER" && (
          <>
            <Link to="/" className="flex items-center gap-1">
              <Home size={20} /> Home
            </Link>
            <Link to="/about" className="flex items-center gap-1">
              <Info size={20} /> About
            </Link>
            <Link to="/menu" className="flex items-center gap-1">
              <Utensils size={20} /> Menu
            </Link>
            <Link to="/orders" className="flex items-center gap-1">
              <ClipboardList size={20} /> Orders
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {/* Tombol login jika belum login */}
        {!role && (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <LogIn size={18} /> Login
          </button>
        )}

        {/* Tombol logout jika sudah login */}
        {role && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <LogOut size={20} />
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <MenuIcon size={26} />}
        </button>
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-md py-4 flex flex-col gap-4 px-6">
            {role === "CUSTOMER" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <Home size={20} /> Home
                </Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <Info size={20} /> About
                </Link>
                <Link to="/menu" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <Utensils size={20} /> Menu
                </Link>
                <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <ClipboardList size={20} /> Orders
                </Link>
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-2 relative">
                  <ShoppingCart size={20} /> Cart
                  {cartCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {!role && (
              <button
                onClick={() => { setIsOpen(false); handleLogin(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                <LogIn size={18} /> Login
              </button>
            )}

            {role && (
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
