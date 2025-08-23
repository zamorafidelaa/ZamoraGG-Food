import React, { useEffect, useState } from "react";
import { Truck, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:8080/courier-assignments";

const UnassignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUnassigned();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Unassigned Orders
      </h2>

      <button
        onClick={fetchUnassigned}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        <RefreshCw className="w-4 h-4" /> Refresh
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No unassigned orders 🎉</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="font-semibold">Order ID: {order.id}</p>
              <p>Customer: {order.customerName}</p>
              <p>Restaurant: {order.restaurantName}</p>
              <p>Total: Rp {order.totalPrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnassignedOrders;
