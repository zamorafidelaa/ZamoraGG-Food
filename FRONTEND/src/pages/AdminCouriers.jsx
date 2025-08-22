import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080/users";

const AdminCouriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adminId = localStorage.getItem("userId");

  const fetchCouriers = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      const courierList = data.filter((u) => u.role === "COURIER");
      setCouriers(courierList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const openModal = (courier = null) => {
    if (courier) {
      setName(courier.name);
      setEmail(courier.email);
      setPassword("");
      setEditId(courier.id);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) {
      setMessage("Admin not logged in!");
      return;
    }

    try {
      let url = `${API_BASE}/register/courier/${adminId}`;
      let method = "POST";

      if (editId) {
        url = `${API_BASE}/courier/${adminId}/${editId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Action completed");

      setTimeout(() => setMessage(""), 3000);

      closeModal();
      fetchCouriers();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this courier?")) return;

    try {
      const res = await fetch(`${API_BASE}/courier/${adminId}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setMessage(data.message || "Courier deleted");
      setTimeout(() => setMessage(""), 3000);
      fetchCouriers();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Manage Couriers</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900"
        >
          + Add Courier
        </button>
      </div>

      {message && (
        <p className="mb-4 text-center text-green-600 font-semibold">
          {message}
        </p>
      )}

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => openModal(c)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-800">
                {editId ? "Edit Courier" : "Add Courier"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                {!editId && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                  />
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-800 text-white hover:bg-blue-900"
                  >
                    {editId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCouriers;
