import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const userId = localStorage.getItem("userId");

  // Ambil cart
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/cart/${userId}`)
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch((err) => console.error("Failed to load cart:", err));
    }
  }, [userId]);

  // Ambil alamat user
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/addresses/user/${userId}`)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.data) {
            setAddresses(resJson.data);
            if (resJson.data.length > 0) setSelectedAddressId(resJson.data[0].id);
          } else {
            setAddresses([]);
          }
        })
        .catch((err) => console.error("Failed to load addresses:", err));
    }
  }, [userId]);

  // Toggle item selection
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

  // Update quantity
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItem = cart.find((c) => c.id === cartId);
    if (!updatedItem) return;
    try {
      const res = await fetch("http://localhost:8080/cart", {
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
      console.error("Update quantity failed:", err);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await fetch(`http://localhost:8080/cart/${cartId}`, { method: "DELETE" });
      setCart((prev) => prev.filter((item) => item.id !== cartId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  // Tambah alamat
  const handleAddAddress = async () => {
    const { street, city, postalCode, phone } = newAddress;
    if (!street || !city || !postalCode || !phone) {
      setMessage("⚠️ Please fill all address fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/addresses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddress, user: { id: parseInt(userId, 10) } }),
      });
      const data = await res.json();
      if (res.ok && data) {
        setAddresses((prev) => [...prev, data]);
        setSelectedAddressId(data.id);
        setShowAddressModal(false);
        setNewAddress({ street: "", city: "", postalCode: "", phone: "" });
        setMessage("✅ Address added successfully!");
      } else {
        setMessage(data.message || "❌ Failed to add address.");
      }
    } catch (err) {
      console.error("Add address error:", err);
      setMessage("❌ Failed to connect to server.");
    }
  };

  // Checkout
  const handleCheckoutClick = async () => {
    if (!userId) return setMessage("⚠️ You must be logged in to checkout.");
    if (selectedItems.length === 0) return setMessage("⚠️ Please select at least one item.");
    if (!selectedAddressId) return setShowAddressModal(true);

    try {
      const res = await fetch("http://localhost:8080/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { id: parseInt(userId, 10) },
          address: { id: parseInt(selectedAddressId, 10) },
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
      order: { ...pendingOrder, checkoutTime: new Date().toLocaleString() },
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
    doc.setFontSize(18);
    doc.text("Receipt", 14, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Checkout Time: ${order.checkoutTime}`, 14, 38);
    doc.text(
      `Delivery To: ${order.address?.street}, ${order.address?.city}, ${order.address?.postalCode}`,
      14,
      46
    );
    const rows = items.map((item) => [
      item.menu.name,
      item.quantity,
      `Rp ${item.menu.price.toLocaleString("id-ID")}`,
      `Rp ${(item.menu.price * item.quantity).toLocaleString("id-ID")}`,
    ]);
    doc.autoTable({ head: [["Item", "Qty", "Price", "Total"]], body: rows, startY: 55 });
    doc.text(`Grand Total: Rp ${order.totalPrice?.toLocaleString("id-ID")}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("receipt.pdf");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={toggleSelectAll}
              disabled={cart.length === 0}
              className={`text-sm px-3 py-1 rounded-lg transition ${
                cart.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
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
              <img
                src={item.menu.imageUrl ? `http://localhost:8080${item.menu.imageUrl}` : "/food-placeholder.jpg"}
                alt={item.menu.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.menu.name}</h3>
                <p className="text-sm text-gray-500">{item.menu.restaurant?.name || "Unknown Restaurant"}</p>
                <p className="text-blue-600 font-bold">Rp {item.menu.price.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="bg-gray-200 px-2 rounded-md hover:bg-gray-300">-</button>
                <span className="px-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 px-2 rounded-md hover:bg-gray-300">+</button>
              </div>
              <div className="font-semibold text-gray-700 w-28 text-right">Rp {(item.menu.price * item.quantity).toLocaleString("id-ID")}</div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold hover:text-red-700">✕</button>
            </motion.div>
          ))}

          <button
            onClick={handleCheckoutClick}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition"
          >
            Checkout Selected Items
          </button>
        </>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* Modals */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Add Delivery Address</h2>
              <input type="text" placeholder="Street" value={newAddress.street || ""} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full border p-2 mb-2 rounded-lg" />
              <input type="text" placeholder="City" value={newAddress.city || ""} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full border p-2 mb-2 rounded-lg" />
              <input type="text" placeholder="Postal Code" value={newAddress.postalCode || ""} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="w-full border p-2 mb-2 rounded-lg" />
              <input type="text" placeholder="Phone" value={newAddress.phone || ""} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full border p-2 mb-4 rounded-lg" />
              <div className="flex gap-2">
                <button onClick={() => setShowAddressModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                <button onClick={handleAddAddress} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Add Address</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showConfirm && pendingOrder && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Confirm Checkout</h2>
              <p className="mb-4">You are about to checkout {itemsToCheckout.length} item(s).</p>
              <p className="mb-4 font-semibold">Delivery Address: {addresses.find((a) => a.id === selectedAddressId)?.street}, {addresses.find((a) => a.id === selectedAddressId)?.city}, {addresses.find((a) => a.id === selectedAddressId)?.postalCode}</p>
              <div className="flex gap-2">
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                <button onClick={confirmCheckout} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showReceipt && receiptData && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Receipt</h2>
              <p>Order ID: {receiptData.order.id}</p>
              <p>Checkout Time: {receiptData.order.checkoutTime}</p>
              <p>Delivery To: {receiptData.order.address?.street}, {receiptData.order.address?.city}, {receiptData.order.address?.postalCode}</p>
              <ul className="my-4 list-disc list-inside">
                {receiptData.items.map((item) => (
                  <li key={item.id}>{item.menu.name} x {item.quantity} = Rp {(item.menu.price * item.quantity).toLocaleString("id-ID")}</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => setShowReceipt(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Close</button>
                <button onClick={printReceipt} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Print PDF</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
