import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/orders";

// Mapping status ke step progress
const statusSteps = ["PENDING", "ASSIGNED", "PICKED_UP", "ON_DELIVERY", "DELIVERED"];

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  // Polling setiap 5 detik
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/customer/${userId}/history`);
        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // refresh 5 detik
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = statusSteps.indexOf(order.status);
            return (
              <div
                key={order.id}
                className="border p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Order ID: {order.id}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "ON_DELIVERY"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Created at: {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    {statusSteps.map((step, idx) => (
                      <span
                        key={step}
                        className={`${
                          idx <= currentStep
                            ? "text-blue-600 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {step.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                  <div className="relative h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className="absolute h-2 bg-blue-600 rounded-full"
                      style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="mt-2">
                  <h4 className="font-semibold">Items:</h4>
                  <ul className="list-disc list-inside">
                    {order.items?.map((item) => (
                      <li key={item.id}>
                        {item.menu?.name} x {item.quantity} - Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-2 text-sm text-gray-700">
                  Delivery Fee: Rp {order.deliveryFee?.toLocaleString("id-ID")}
                </p>
                <p className="mt-1 font-bold">
                  Total: Rp {order.totalPrice?.toLocaleString("id-ID")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
