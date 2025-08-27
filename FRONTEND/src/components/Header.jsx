import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);

  const userId = localStorage.getItem("userId");

  // fetch cart count dari backend
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
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // helper class untuk link
  const linkClass = (path) =>
    `flex items-center gap-1 px-3 py-1 rounded-lg transition-colors duration-150 ${
      activeLink === path ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="font-extrabold text-2xl text-blue-600">
        <Link to="/" onClick={() => setActiveLink("/")}>
          ZamoraGG <span className="text-blue-400">Food</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-4">
        {role === "CUSTOMER" && (
          <>
            <Link to="/" onClick={() => setActiveLink("/")} className={linkClass("/")}>
              <Home size={20} /> Home
            </Link>
            <Link to="/about" onClick={() => setActiveLink("/about")} className={linkClass("/about")}>
              <Info size={20} /> About
            </Link>
            <Link to="/menu" onClick={() => setActiveLink("/menu")} className={linkClass("/menu")}>
              <Utensils size={20} /> Menu
            </Link>
            <Link to="/orders" onClick={() => setActiveLink("/orders")} className={linkClass("/orders")}>
              <ClipboardList size={20} /> Orders
            </Link>
            <Link to="/cart" onClick={() => setActiveLink("/cart")} className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {!role && (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <LogIn size={18} /> Login
          </button>
        )}

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
          <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-md py-4 flex flex-col gap-2 px-6">
            {role === "CUSTOMER" && (
              <>
                <Link to="/" onClick={() => { setActiveLink("/"); setIsOpen(false); }} className={linkClass("/")}>
                  <Home size={20} /> Home
                </Link>
                <Link to="/about" onClick={() => { setActiveLink("/about"); setIsOpen(false); }} className={linkClass("/about")}>
                  <Info size={20} /> About
                </Link>
                <Link to="/menu" onClick={() => { setActiveLink("/menu"); setIsOpen(false); }} className={linkClass("/menu")}>
                  <Utensils size={20} /> Menu
                </Link>
                <Link to="/orders" onClick={() => { setActiveLink("/orders"); setIsOpen(false); }} className={linkClass("/orders")}>
                  <ClipboardList size={20} /> Orders
                </Link>
                <Link to="/cart" onClick={() => { setActiveLink("/cart"); setIsOpen(false); }} className="relative">
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
