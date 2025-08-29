import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE}/cart/${userId}`)
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch(console.error);

      fetch(`${API_BASE}/users/${userId}`)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.data) {
            const user = resJson.data;
            setAddress({
              street: user.street || "",
              city: user.city || "",
              postalCode: user.postalCode || "",
              phone: user.phone || "",
            });
          }
        })
        .catch(console.error);
    }
  }, [userId]);

  const toggleSelect = (id) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) setSelectedItems([]);
    else setSelectedItems(cart.map((item) => item.id));
  };

  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  const itemsToCheckout = cart.filter((item) =>
    selectedItems.includes(item.id)
  );

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItem = cart.find((c) => c.id === cartId);
    if (!updatedItem) return;
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedItem, quantity: newQuantity }),
      });
      if (res.ok) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === cartId ? { ...item, quantity: newQuantity } : item
          )
        );
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await fetch(`${API_BASE}/cart/${cartId}`, { method: "DELETE" });
      setCart((prev) => prev.filter((item) => item.id !== cartId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutClick = async () => {
    if (!userId) return setMessage("⚠️ You must be logged in to checkout.");
    if (selectedItems.length === 0)
      return setMessage("⚠️ Please select at least one item.");
    if (
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.phone
    ) {
      return setMessage(
        "Customer address is incomplete. Please fill it before checkout."
      );
    }

    try {
      const res = await fetch(`${API_BASE}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { id: parseInt(userId, 10) },
          items: itemsToCheckout.map((item) => ({
            menu: { id: item.menu.id },
            quantity: item.quantity,
          })),
        }),
      });
      const result = await res.json();
      if (res.ok && result.data) {
        setPendingOrder(result.data);
        setShowConfirm(true);
        setMessage("");
      } else setMessage(result.message || "❌ Failed to prepare order.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to connect to server.");
    }
  };

  const confirmCheckout = async () => {
    if (!pendingOrder) return;
    const subtotal = itemsToCheckout.reduce(
      (sum, item) => sum + item.menu.price * item.quantity,
      0
    );
    const deliveryFee = pendingOrder.order.deliveryFee || 0;

    setReceiptData({
      order: {
        ...pendingOrder.order,
        checkoutTime: new Date().toLocaleString(),
        totalPrice: subtotal + deliveryFee,
        deliveryFee,
        address: { ...address },
      },
      items: itemsToCheckout,
    });

    setMessage("✅ Checkout successful!");
    setShowReceipt(true);
    itemsToCheckout.forEach((item) => removeFromCart(item.id));
    setSelectedItems([]);
    setPendingOrder(null);
    setShowConfirm(false);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const printReceipt = () => {
    if (!receiptData) return;
    const { order, items } = receiptData;
    const doc = new jsPDF();
    let y = 20;
    doc.setFont("courier", "normal");
    doc.setFontSize(14);
    doc.text("===== RECEIPT =====", 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Order ID   : ${order.id}`, 14, y);
    y += 7;
    doc.text(`Checkout   : ${order.checkoutTime}`, 14, y);
    y += 7;
    doc.text(`Delivery To: ${order.address.street}`, 14, y);
    y += 6;
    doc.text(
      `            ${order.address.city}, ${order.address.postalCode}`,
      14,
      y
    );
    y += 6;
    doc.text(`Phone      : ${order.address.phone}`, 14, y);
    y += 10;
    doc.text("-------------------------------", 14, y);
    y += 6;
    doc.text("Item                Qty   Total", 14, y);
    y += 6;
    doc.text("-------------------------------", 14, y);
    y += 6;
    items.forEach((item) => {
      let name =
        item.menu.name.length > 16
          ? item.menu.name.slice(0, 16) + "…"
          : item.menu.name;
      let qty = item.quantity.toString().padStart(3, " ");
      let total = (item.menu.price * item.quantity)
        .toLocaleString("id-ID")
        .padStart(7, " ");
      doc.text(`${name.padEnd(18, " ")} ${qty} ${total}`, 14, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.text("-------------------------------", 14, y);
    y += 6;
    doc.text(
      `Subtotal       : ${items
        .reduce((sum, item) => sum + item.menu.price * item.quantity, 0)
        .toLocaleString("id-ID")}`,
      14,
      y
    );
    y += 6;
    doc.text(
      `Delivery Fee   : ${order.deliveryFee.toLocaleString("id-ID")}`,
      14,
      y
    );
    y += 6;
    doc.text(
      `TOTAL          : ${order.totalPrice.toLocaleString("id-ID")}`,
      14,
      y
    );
    y += 10;
    doc.text("===============================", 14, y);
    y += 6;
    doc.text("Thank you for your order!", 14, y);
    doc.save("receipt.pdf");
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto mb-52">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 sm:mb-6">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 sm:gap-0">
            <button
              onClick={toggleSelectAll}
              disabled={cart.length === 0}
              className={`text-sm px-3 py-1 rounded-lg transition ${
                cart.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-gray-600 mt-1 sm:mt-0">
              {selectedItems.length} / {cart.length} selected
            </span>
          </div>

          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap sm:flex-nowrap items-center bg-white shadow-md rounded-2xl p-3 sm:p-4 gap-3 sm:gap-4 hover:shadow-lg transition"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-5 h-5 accent-blue-500 mt-1"
              />

              <img
                src={
                  item.menu.imageUrl
                    ? `${API_BASE}${item.menu.imageUrl}`
                    : "/food-placeholder.jpg"
                }
                alt={item.menu.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-[120px]">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
                  {item.menu.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {item.menu.restaurant?.name || "Unknown Restaurant"}
                </p>
                <p className="text-blue-600 font-bold text-sm sm:text-base">
                  Rp {item.menu.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 px-2 sm:px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-2 text-sm sm:text-base">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 px-2 sm:px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <div className="font-semibold text-gray-700 text-sm sm:text-base mt-2 sm:mt-0 w-full sm:w-28 text-right">
                Rp {(item.menu.price * item.quantity).toLocaleString("id-ID")}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 font-bold hover:text-red-700 mt-2 sm:mt-0"
              >
                ✕
              </button>
            </motion.div>
          ))}

          <button
            onClick={handleCheckoutClick}
            className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition"
          >
            Checkout Selected Items
          </button>
        </>
      )}

      {message && (
        <p className="mt-4 text-green-600 text-sm sm:text-base">{message}</p>
      )}

      <AnimatePresence>
        {showConfirm && pendingOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh]"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
                Confirm Checkout
              </h2>

              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <input
                type="text"
                placeholder="Street"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded-lg text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded-lg text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={(e) =>
                  setAddress({ ...address, postalCode: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded-lg text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Phone"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
                className="w-full border p-2 mb-4 rounded-lg text-sm sm:text-base"
              />

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Order Details:</h3>
                <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto text-sm sm:text-base">
                  {itemsToCheckout.map((item) => (
                    <li key={item.id} className="py-1 flex justify-between">
                      <span>
                        {item.menu.name} x {item.quantity}
                      </span>
                      <span>
                        Rp{" "}
                        {(item.menu.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-2 flex justify-between font-semibold text-sm sm:text-base">
                <span>Subtotal:</span>
                <span>
                  Rp{" "}
                  {itemsToCheckout
                    .reduce(
                      (sum, item) => sum + item.menu.price * item.quantity,
                      0
                    )
                    .toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mb-2 flex justify-between font-semibold text-sm sm:text-base">
                <span>Delivery Fee:</span>
                <span>
                  Rp{" "}
                  {pendingOrder.order.deliveryFee?.toLocaleString("id-ID") || 0}
                </span>
              </div>

              <div className="mb-4 flex justify-between font-bold text-blue-600 text-sm sm:text-base">
                <span>Total:</span>
                <span>
                  Rp{" "}
                  {(
                    itemsToCheckout.reduce(
                      (sum, item) => sum + item.menu.price * item.quantity,
                      0
                    ) + (pendingOrder.order.deliveryFee || 0)
                  ).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCheckout}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showReceipt && receiptData && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh] font-mono"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
                RECEIPT
              </h2>
              <p className="text-sm sm:text-base">
                Order ID : {receiptData.order.id}
              </p>
              <p className="text-sm sm:text-base">
                Checkout : {receiptData.order.checkoutTime}
              </p>
              <p className="text-sm sm:text-base">
                Delivery To: {receiptData.order.address.street},{" "}
                {receiptData.order.address.city},{" "}
                {receiptData.order.address.postalCode}
              </p>
              <p className="text-sm sm:text-base">
                Phone : {receiptData.order.address.phone}
              </p>
              <hr className="my-2" />
              <ul className="my-2 list-disc list-inside text-sm sm:text-base">
                {receiptData.items.map((item) => (
                  <li key={item.id}>
                    {item.menu.name} x {item.quantity} = Rp{" "}
                    {(item.menu.price * item.quantity).toLocaleString("id-ID")}
                  </li>
                ))}
              </ul>
              <hr className="my-2" />
              <div className="mb-2 flex justify-between font-semibold text-sm sm:text-base">
                <span>Subtotal:</span>
                <span>
                  Rp{" "}
                  {receiptData.items
                    .reduce(
                      (sum, item) => sum + item.menu.price * item.quantity,
                      0
                    )
                    .toLocaleString("id-ID")}
                </span>
              </div>
              <div className="mb-2 flex justify-between font-semibold text-sm sm:text-base">
                <span>Delivery Fee:</span>
                <span>
                  Rp{" "}
                  {receiptData.order.deliveryFee?.toLocaleString("id-ID") || 0}
                </span>
              </div>
              <div className="mb-4 flex justify-between font-bold text-blue-600 text-sm sm:text-base">
                <span>Total:</span>
                <span>
                  Rp {receiptData.order.totalPrice?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={printReceipt}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                >
                  Print PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
