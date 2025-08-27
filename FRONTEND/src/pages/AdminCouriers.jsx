import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react"; 

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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-800">
          Couriers Management
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          + Add Courier
        </button>
      </div>

      {message && (
        <motion.p
          className="mb-4 text-center text-green-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {message}
        </motion.p>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full table-auto">
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
                    title="Edit Courier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center transition"
                    title="Delete Courier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-800">
                {editId ? "Edit Courier" : "Add New Courier"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                />
                {!editId && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required
                  />
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
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
