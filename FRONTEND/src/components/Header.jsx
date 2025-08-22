import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link to="/">DeliveryFood</Link>
      </div>

      <nav className="space-x-4">
        {role === "CUSTOMER" && <Link to="/">Home</Link>}
        {role && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
        {!role && <Link to="/login">Login</Link>}
      </nav>
    </header>
  );
};

export default Header;
