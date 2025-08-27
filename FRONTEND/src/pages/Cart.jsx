import React, { useContext, useState } from "react";
import { CartContext } from "../components/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const userId = localStorage.getItem("userId");

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  const itemsToCheckout = cart.filter((item) => selectedItems.includes(item.id));

  const handleCheckoutClick = async () => {
    if (!userId) {
      setMessage("⚠️ You must be logged in to checkout.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("⚠️ Please select at least one item to checkout.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { id: parseInt(userId, 10) },
          items: itemsToCheckout.map((item) => ({
            menu: { id: item.id },
            quantity: item.quantity,
          })),
        }),
      });

      const result = await res.json();
      if (res.ok && result.data) {
        setPendingOrder(result.data);
        setShowConfirm(true);
      } else {
        setMessage(result.message || "❌ Failed to prepare order.");
      }
    } catch (err) {
      console.error("Checkout preview error:", err);
      setMessage("❌ Failed to connect to server.");
    }
  };

  const confirmCheckout = async () => {
    if (!pendingOrder) return;

    setReceiptData({
      order: {
        ...pendingOrder,
        checkoutTime: new Date().toLocaleString(),
      },
      items: itemsToCheckout,
    });

    setMessage("✅ Checkout successful!");
    setShowReceipt(true);

    itemsToCheckout.forEach((item) => removeFromCart(item.id));
    setSelectedItems([]);
    setPendingOrder(null);
    setShowConfirm(false);
  };

  const printReceipt = () => {
    if (!receiptData) return;
    const { order, items } = receiptData;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Receipt", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Checkout Time: ${order.checkoutTime}`, 14, 38);
    doc.text(`Customer ID: ${order.customer?.id || "-"}`, 14, 46);
    doc.text(
      `Delivery Fee: Rp ${order.deliveryFee?.toLocaleString("id-ID")}`,
      14,
      54
    );

    const rows = items.map((item) => [
      item.name,
      item.quantity,
      `Rp ${item.price.toLocaleString("id-ID")}`,
      `Rp ${(item.price * item.quantity).toLocaleString("id-ID")}`,
    ]);

    doc.autoTable({
      head: [["Item", "Qty", "Price", "Total"]],
      body: rows,
      startY: 65,
    });

    doc.text(
      `Grand Total: Rp ${order.totalPrice?.toLocaleString("id-ID")}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("receipt.pdf");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex justify-between items-center mb-2">
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
            <span className="text-sm text-gray-600">
              {selectedItems.length} / {cart.length} selected
            </span>
          </div>

          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center bg-white shadow-md rounded-2xl p-4 gap-4 hover:shadow-lg transition"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-5 h-5 accent-blue-500"
              />

              {/* ✅ Gambar menu dengan fade-in */}
              <motion.img
                src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : "/food-placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.restaurantName || item.restaurant?.name || "Unknown Restaurant"}
                </p>
                <p className="text-blue-600 font-bold">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 px-2 rounded-md hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 px-2 rounded-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <div className="font-semibold text-gray-700 w-28 text-right">
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 font-bold hover:text-red-700"
              >
                ✕
              </button>
            </motion.div>
          ))}

          <button
            onClick={handleCheckoutClick}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition"
          >
            Checkout Selected Items
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* Confirmation & Receipt Modals */}
      <AnimatePresence>
        {showConfirm && pendingOrder && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Confirm Your Order</h2>
              {itemsToCheckout.map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-2">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
              <hr className="my-3" />
              <p className="text-sm text-gray-700">
                Delivery Fee: Rp {pendingOrder.deliveryFee?.toLocaleString("id-ID")}
              </p>
              <p className="text-right font-bold text-gray-800">
                Total: Rp {pendingOrder.totalPrice?.toLocaleString("id-ID")}
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                <button onClick={confirmCheckout}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Confirm Checkout</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showReceipt && receiptData && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Receipt</h2>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Order ID:</span> {receiptData.order.id}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Checkout Time:</span> {receiptData.order.checkoutTime}
              </p>

              {receiptData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="font-semibold">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              <hr className="my-4" />
              <p className="text-sm text-gray-600">
                Delivery Fee: Rp {receiptData.order.deliveryFee?.toLocaleString("id-ID")}
              </p>
              <p className="text-right font-bold text-gray-800">
                Total: Rp {receiptData.order.totalPrice?.toLocaleString("id-ID")}
              </p>

              <div className="mt-4 flex gap-2">
                <button onClick={printReceipt} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Print PDF</button>
                <button onClick={() => setShowReceipt(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
