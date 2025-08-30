// src/pages/AdminRestaurants.jsx
import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/restaurants`;

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    }
  };

  const openModal = (restaurant = null) => {
    if (restaurant) {
      setName(restaurant.name);
      setAddress(restaurant.address);
      setPhone(restaurant.phone);
      setEditId(restaurant.id);
    } else {
      setName("");
      setAddress("");
      setPhone("");
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setAddress("");
    setPhone("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId
        ? `${API_BASE}/update/${editId}`
        : `${API_BASE}/create`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, phone }),
      });

      if (!res.ok) throw new Error("Request failed");

      await fetchRestaurants();
      closeModal();
      setMessage(editId ? "Restaurant updated!" : "Restaurant added!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchRestaurants();
      setMessage("Restaurant deleted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const filtered = restaurants
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      return order === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
          Restaurants Management
        </h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Restaurant
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

      <div className="flex flex-col sm:flex-row gap-4 mb-4 flex-wrap">
        <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/2 bg-white shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full text-sm sm:text-base"
          />
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm sm:text-base"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full table-auto text-sm sm:text-base">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-3 sm:px-4 py-2 text-left">ID</th>
              <th className="px-3 sm:px-4 py-2 text-left">Name</th>
              <th className="px-3 sm:px-4 py-2 text-left">Address</th>
              <th className="px-3 sm:px-4 py-2 text-left">Phone</th>
              <th className="px-3 sm:px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b hover:bg-blue-50 transition-colors"
              >
                <td className="px-3 sm:px-4 py-2">{r.id}</td>
                <td className="px-3 sm:px-4 py-2">{r.name}</td>
                <td className="px-3 sm:px-4 py-2">{r.address}</td>
                <td className="px-3 sm:px-4 py-2">{r.phone}</td>
                <td className="px-3 sm:px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => openModal(r)}
                    className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded flex items-center justify-center transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No restaurants found.
          </p>
        )}
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <p>
              <span className="font-semibold">ID:</span> {r.id}
            </p>
            <p>
              <span className="font-semibold">Name:</span> {r.name}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {r.address}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {r.phone}
            </p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => openModal(r)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded flex items-center justify-center transition"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">
                {editId ? "Edit Restaurant" : "Add New Restaurant"}
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
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                  required
                />
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 sm:px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition text-sm sm:text-base w-full sm:w-auto"
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

export default AdminRestaurants;
