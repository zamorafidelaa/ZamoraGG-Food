import React, { useEffect, useState } from "react";

const OrderHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/orders/get")
      .then((res) => res.json())
      .then((data) => setHistory(data.data || []))
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Order History</h1>

      {history.length === 0 ? (
        <p className="text-gray-600">No order history found.</p>
      ) : (
        <div className="space-y-6">
          {history.map((order) => (
            <div
              key={order.id}
              className="border p-5 rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-lg">
                  Order #{order.id}
                </p>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-3">
                {order.items?.length > 0 ? (
                  order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-gray-700"
                    >
                      <span>
                        {it.menu?.name} × {it.quantity}
                      </span>
                      <span className="font-medium">
                        ${(it.menu?.price || 0) * it.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No items</p>
                )}
              </div>

              {/* Total */}
              <div className="text-right font-bold text-blue-600">
                Total: ${order.totalPrice || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
