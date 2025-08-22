import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
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
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Welcome, Admin!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="font-semibold text-lg mb-2">Manage Couriers</h2>
            <p>Tambahkan, hapus, atau ubah data kurir.</p>
            <Link
              to="/admin/couriers"
              className="mt-4 inline-block text-blue-900 font-semibold hover:underline"
            >
              Go
            </Link>
          </div>

          <div className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="font-semibold text-lg mb-2">Manage Restaurants</h2>
            <p>Kelola data restoran yang terdaftar.</p>
            <Link
              to="/admin/restaurants"
              className="mt-4 inline-block text-blue-900 font-semibold hover:underline"
            >
              Go
            </Link>
          </div>

          <div className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="font-semibold text-lg mb-2">View Orders</h2>
            <p>Lihat semua pesanan yang masuk.</p>
            <Link
              to="/admin/orders"
              className="mt-4 inline-block text-blue-900 font-semibold hover:underline"
            >
              Go
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
