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
  X,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-gradient-to-b from-blue-200 to-blue-400 text-white transition-transform duration-300 flex flex-col rounded-tr-xl md:rounded-tr-none rounded-br-xl md:rounded-br-none shadow-sm`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-300">
          <span className="text-xl font-bold text-gray-900 select-none">
            Admin Panel
          </span>
          <button
            className="p-1 rounded hover:bg-blue-300 transition-colors md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col mt-4 gap-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-blue-300 hover:shadow-sm text-gray-900"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-2 p-3 bg-red-400 hover:bg-red-500 rounded-lg transition-all duration-300 shadow-sm"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar (Mobile) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          <div className="w-6 h-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 md:p-6 bg-gray-50 transition-all duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
