import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Home,
  Users,
  List,
  Coffee,
  Package,
  ClipboardList,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/admin/dashboard" },
    { name: "Manage Couriers", icon: <Users className="w-5 h-5" />, path: "/admin/couriers" },
    { name: "Manage Restaurants", icon: <Coffee className="w-5 h-5" />, path: "/admin/restaurants" },
    { name: "Manage Menus", icon: <List className="w-5 h-5" />, path: "/admin/menus" },
    { name: "Assign Courier", icon: <Package className="w-5 h-5" />, path: "/admin/unassigned" },
    { name: "Revenue Reports", icon: <ClipboardList className="w-5 h-5" />, path: "/admin/reports" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-200 to-blue-400 text-white transition-all duration-500 flex flex-col rounded-tr-xl rounded-br-xl shadow-sm relative`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-300">
          <span className={`${sidebarOpen ? "text-xl font-bold text-gray-900" : "hidden"} select-none`}>
            Admin Panel
          </span>
          <button
            className="p-1 rounded hover:bg-blue-300 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col mt-4 gap-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-blue-300 hover:shadow-sm text-gray-900`}
            >
              {item.icon}
              <span className={`${sidebarOpen ? "inline" : "hidden"} font-medium`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-4 left-4 right-4 flex items-center gap-2 p-3 bg-red-400 hover:bg-red-500 rounded-lg transition-all duration-300 shadow-sm"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className={`${sidebarOpen ? "inline" : "hidden"} font-medium text-white`}>
            Logout
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 transition-all duration-500">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
