import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:8080/menus";
const RESTO_API = "http://localhost:8080/restaurants";

const AdminMenus = () => {
  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  // form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetch menus & restaurants
  useEffect(() => {
    fetchMenus();
    fetchRestaurants();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(`${API_BASE}/get`);
      const data = await res.json();
      setMenus(data.data || []);
    } catch (err) {
      console.error("Failed to fetch menus", err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${RESTO_API}`);
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    }
  };

  const openModal = (menu = null) => {
    if (menu) {
      setName(menu.name);
      setPrice(menu.price);
      setDescription(menu.description);
      setRestaurantId(menu.restaurant?.id || "");
      setEditId(menu.id);
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setRestaurantId("");
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPrice("");
    setDescription("");
    setRestaurantId("");
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

      const payload = {
        name,
        price: parseFloat(price),
        description,
        restaurant: { id: parseInt(restaurantId) },
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");
      await fetchMenus();
      closeModal();
      setMessage(editId ? "Menu updated!" : "Menu added!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchMenus();
      setMessage("Menu deleted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const filtered = menus
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Manage Menus</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900"
        >
          <Plus size={18} /> Add Menu
        </button>
      </div>

      {/* Message */}
      {message && (
        <p className="mb-4 text-center text-green-600 font-semibold">{message}</p>
      )}

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search menus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Restaurant</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="text-center border-b">
                <td className="px-4 py-2">{m.id}</td>
                <td className="px-4 py-2">{m.name}</td>
                <td className="px-4 py-2">Rp {m.price}</td>
                <td className="px-4 py-2">{m.description}</td>
                <td className="px-4 py-2">{m.restaurant?.name}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => openModal(m)}
                    className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No menus found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                {editId ? "Edit Menu" : "Add Menu"}
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
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <select
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="border p-2 rounded"
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
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

export default AdminMenus;
