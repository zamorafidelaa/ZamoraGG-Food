import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080/restaurants";

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
      let url = `${API_BASE}/create`;
      let method = "POST";

      if (editId) {
        url = `${API_BASE}/update/${editId}`;
        method = "PUT";
      }

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
    .filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-800">
          Restaurants Management
        </h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          <Plus size={18} /> Add Restaurant
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

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/2 bg-white shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full table-auto">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.address}</td>
                <td className="px-4 py-2">{r.phone}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => openModal(r)}
                    className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No restaurants found.
                </td>
              </tr>
            )}
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
                {editId ? "Edit Restaurant" : "Add New Restaurant"}
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
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                />
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

export default AdminRestaurants;
