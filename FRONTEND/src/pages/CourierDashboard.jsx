// src/pages/CourierDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { User, Home, ClipboardList, Clock, Check, LogOut } from "lucide-react";

const API_BASE = "http://localhost:8080/courier-assignments";
const statusOrder = ["ASSIGNED", "PICKED_UP", "ON_DELIVERY", "DELIVERED"];
const statusColors = {
  ASSIGNED: "#60a5fa",
  PICKED_UP: "#facc15",
  ON_DELIVERY: "#a78bfa",
  DELIVERED: "#4ade80",
};

const CourierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil tab terakhir dari localStorage, default "Dashboard"
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Dashboard"
  );

  const courierId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    if (!courierId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/courier-orders/${courierId}`);
      const data = await res.json();
      setOrders(data.data || []);

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE}/update-status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [courierId]);

  if (!courierId)
    return <p className="p-6 text-red-500">Please login as courier.</p>;

  const activeOrders = orders.filter((o) => o.status !== "DELIVERED");
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");

  const getProgressPercent = (status) => {
    const index = statusOrder.indexOf(status);
    return index === -1 ? 0 : ((index + 1) / statusOrder.length) * 100;
  };

  const nextStatus = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "PICKED_UP";
      case "PICKED_UP":
        return "ON_DELIVERY";
      case "ON_DELIVERY":
        return "DELIVERED";
      default:
        return null;
    }
  };

  const summary = {
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    deliveredOrders: deliveredOrders.length,
  };

  const chartData = statusOrder.map((status) => ({
    name: status,
    value: orders.filter((o) => o.status === status).length,
  }));

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-100 text-blue-900 p-6 flex flex-col justify-between">
        <div>
          {/* Profile */}
          <div className="flex items-center mb-6 space-x-3">
            <User className="w-10 h-10 text-blue-600" />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            {[
              { name: "Dashboard", icon: <Home className="w-4 h-4 inline mr-2" /> },
              { name: "Orders", icon: <ClipboardList className="w-4 h-4 inline mr-2" /> },
              { name: "History", icon: <Clock className="w-4 h-4 inline mr-2" /> },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className={`text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                  activeTab === tab.name ? "bg-blue-200 font-semibold shadow" : "hover:bg-blue-100"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500 transition flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <AnimatePresence exitBeforeEnter>
          {activeTab === "Dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-700 mb-6">
                <Home className="w-5 h-5 inline mr-2" /> Dashboard
              </h2>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Total Orders", value: summary.totalOrders, color: "text-blue-600" },
                  { label: "Active Orders", value: summary.activeOrders, color: "text-yellow-600" },
                  { label: "Delivered Orders", value: summary.deliveredOrders, color: "text-green-600" },
                ].map((card) => (
                  <motion.div key={card.label} className="bg-white p-6 rounded-xl shadow hover:shadow-xl flex flex-col items-center transition transform hover:scale-105">
                    <p className="text-gray-500">{card.label}</p>
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Status Chart */}
              <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label isAnimationActive>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={statusColors[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === "Orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-700 mb-6">
                <ClipboardList className="w-5 h-5 inline mr-2" /> Orders
              </h2>
              {activeOrders.length === 0 ? (
                <p className="text-gray-500">No active orders.</p>
              ) : (
                activeOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    className="p-4 border rounded-xl mb-4 bg-white shadow hover:shadow-lg transition flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div className="flex-1">
                      <p><span className="font-semibold">Order ID:</span> {order.id}</p>
<p><span className="font-semibold">Customer:</span> {order.customerName}</p>
<p><span className="font-semibold">Address:</span> {order.customerStreet}, {order.customerCity}, {order.customerPostalCode}</p>
<p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
<p><span className="font-semibold">Total:</span> Rp {order.totalPrice?.toLocaleString("id-ID")}</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                        <div className="h-2 bg-blue-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${getProgressPercent(order.status)}%` }}></div>
                      </div>
                      <p className="text-sm mt-1">Status: <span className="font-semibold">{order.status}</span></p>
                    </div>
                    <div className="mt-3 md:mt-0 md:ml-6">
                      {nextStatus(order.status) ? (
                        <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 shadow transition flex items-center gap-1"
                          onClick={() => updateStatus(order.id, nextStatus(order.status))}>
                          <Check className="w-4 h-4" /> Mark as {nextStatus(order.status)}
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Completed
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "History" && (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-700 mb-6">
                <Clock className="w-5 h-5 inline mr-2" /> History
              </h2>
              {deliveredOrders.length === 0 ? (
                <p className="text-gray-500">No delivered orders yet.</p>
              ) : (
                deliveredOrders.map((order) => (
                  <motion.div key={order.id} className="p-4 rounded-xl bg-blue-50 border-l-4 border-blue-300 shadow-sm hover:shadow-md transition flex justify-between items-start md:items-center">
                    <div>
                      <p><span className="font-semibold">Order ID:</span> {order.id}</p>
<p><span className="font-semibold">Customer:</span> {order.customerName}</p>
<p><span className="font-semibold">Address:</span> {order.customerStreet}, {order.customerCity}, {order.customerPostalCode}</p>
<p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
<p><span className="font-semibold">Total:</span> Rp {order.totalPrice?.toLocaleString("id-ID")}</p>
<p><span className="font-semibold">Delivered At:</span> {new Date(order.createdAt).toLocaleString()}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        {statusOrder.map((s) => (
                          <span key={s} className={`w-3 h-3 rounded-full ${order.status === s ? "bg-blue-500" : "bg-blue-200"} transition-all`}></span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Delivered
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CourierDashboard;
