import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/orders/get")
      .then((res) => res.json())
      .then((data) => setOrders(data.data || []))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow-sm flex justify-between"
            >
              <div>
                <p>Order #{order.id}</p>
                <p>Status: {order.status}</p>
              </div>
              <div>
                {order.items?.map((it, idx) => (
                  <p key={idx}>
                    {it.menu?.name} x {it.quantity}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
