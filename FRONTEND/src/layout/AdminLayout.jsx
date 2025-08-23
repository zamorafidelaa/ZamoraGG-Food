import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-blue-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <span className={`${sidebarOpen ? "text-xl font-bold" : "hidden"}`}>
            Admin Panel
          </span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex flex-col mt-6 gap-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors"
          >
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>
              Dashboard
            </span>
          </Link>
          <Link
            to="/admin/couriers"
            className="flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors"
          >
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>
              Manage Couriers
            </span>
          </Link>
          <Link
            to="/admin/restaurants"
            className="flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors"
          >
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>
              Manage Restaurants
            </span>
          </Link>
          <Link
            to="/admin/menus"
            className="flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors"
          >
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>
              Manage Menus
            </span>
          </Link>
          <Link
            to="/admin/unassigned"
            className="flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors"
          >
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>
              Assign Courier
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center p-3 hover:bg-blue-800 rounded-md transition-colors"
          >
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>
              View Orders
            </span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
