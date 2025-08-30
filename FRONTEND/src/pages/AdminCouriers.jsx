import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
      const res = await fetch(`${API_BASE}/users/all`);
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
      let url = `${API_BASE}/users/register/courier/${adminId}`;
      let method = "POST";

      if (editId) {
        url = `${API_BASE}/users/courier/${adminId}/${editId}`;
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
      const res = await fetch(`${API_BASE}/users/courier/${adminId}/${id}`, {
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
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800">
          Couriers Management
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-3 sm:px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
        >
          + Add Courier
        </button>
      </div>

      {message && (
        <motion.p
          className="mb-4 text-center text-green-600 font-semibold text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {message}
        </motion.p>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white hidden sm:block">
        <table className="w-full table-auto text-sm sm:text-base">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((c) => (
              <tr
                key={c.id}
                className="border-b hover:bg-blue-50 transition-colors"
              >
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => openModal(c)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded flex items-center transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {couriers.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <p className="text-sm text-gray-500">ID: {c.id}</p>
            <h3 className="font-bold text-lg text-blue-800">{c.name}</h3>
            <p className="text-gray-700">{c.email}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openModal(c)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded flex items-center text-sm"
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">
                {editId ? "Edit Courier" : "Add New Courier"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                  required
                />
                {!editId && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                    required
                  />
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
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
