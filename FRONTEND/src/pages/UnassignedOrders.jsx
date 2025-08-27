import React, { useEffect, useState } from "react";
import { Truck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080/courier-assignments";

const UnassignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourier, setSelectedCourier] = useState({}); // { orderId: courierId }

  const fetchUnassigned = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/unassigned-orders`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching unassigned orders:", error);
    }
    setLoading(false);
  };

  const fetchCouriers = async () => {
    try {
      const res = await fetch(`${API_BASE}/available-couriers`);
      const data = await res.json();
      setCouriers(data.data || []);
    } catch (error) {
      console.error("Error fetching couriers:", error);
    }
  };

  const assignCourier = async (orderId) => {
    const courierId = selectedCourier[orderId];
    if (!courierId) {
      alert("Please select a courier first!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/assign/${orderId}/${courierId}`, {
        method: "POST",
      });
      const result = await res.json();
      alert(result.message);
      fetchUnassigned();
      fetchCouriers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnassigned();
    fetchCouriers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 flex items-center gap-2">
          <Truck className="w-6 h-6" /> Unassigned Orders
        </h2>
        <button
          onClick={fetchUnassigned}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center text-lg mt-6">No unassigned orders..</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <p className="font-semibold text-lg text-gray-800 mb-1">Order #{order.id}</p>
                  <p className="text-gray-600">Customer: {order.customerName}</p>
                  <p className="text-gray-600">Total: Rp {order.totalPrice?.toLocaleString("id-ID") || 0}</p>
                  <p className="text-gray-400 text-sm mt-1">Created: {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    value={selectedCourier[order.id] || ""}
                    onChange={(e) =>
                      setSelectedCourier((prev) => ({
                        ...prev,
                        [order.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Courier</option>
                    {couriers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => assignCourier(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
                  >
                    Assign
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default UnassignedOrders;
