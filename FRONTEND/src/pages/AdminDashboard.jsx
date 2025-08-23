import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
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
  );
};

export default AdminDashboard;
