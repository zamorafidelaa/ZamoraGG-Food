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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setImagePreview(menu.imageUrl ? `http://localhost:8080${menu.imageUrl}` : null);
      setImageFile(null);
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setRestaurantId("");
      setEditId(null);
      setImageFile(null);
      setImagePreview(null);
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
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // buat FormData
      const formData = new FormData();
      formData.append(
        "menu",
        new Blob(
          [JSON.stringify({ name, price, description, restaurant: { id: restaurantId } })],
          { type: "application/json" }
        )
      );
      if (imageFile) formData.append("image", imageFile);

      let url = `${API_BASE}/create`;
      let method = "POST";

      if (editId) {
        url = `${API_BASE}/update/${editId}`;
        method = "PUT";
      }

      const res = await fetch(url, { method, body: formData });
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
      return order === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });

  return (
<div className="min-h-screen bg-gray-50 p-4 sm:p-6">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">Manage Menus</h1>
    <button
      onClick={() => openModal()}
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 w-full sm:w-auto justify-center"
    >
      <Plus size={18} /> Add Menu
    </button>
  </div>

  {/* Message */}
  {message && (
    <p className="mb-4 text-center text-green-600 font-semibold text-sm sm:text-base">{message}</p>
  )}

  {/* Search & Sort */}
  <div className="flex flex-col sm:flex-row gap-4 mb-4 flex-wrap">
    <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-1/2 bg-white shadow-sm">
      <Search size={18} className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search menus..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="outline-none w-full text-sm sm:text-base"
      />
    </div>
    <div className="flex gap-2 flex-wrap w-full sm:w-auto">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm sm:text-base">
        <option value="id">Sort by ID</option>
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>
      <select value={order} onChange={(e) => setOrder(e.target.value)} className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm sm:text-base">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  </div>

  {/* Table for desktop */}
  <div className="hidden md:block overflow-x-auto rounded-lg shadow-md bg-white">
    <table className="w-full table-auto text-sm sm:text-base">
      <thead className="bg-blue-100 text-blue-900">
        <tr>
          <th className="px-3 sm:px-4 py-2 text-left">ID</th>
          <th className="px-3 sm:px-4 py-2 text-left">Image</th>
          <th className="px-3 sm:px-4 py-2 text-left">Name</th>
          <th className="px-3 sm:px-4 py-2 text-left">Price</th>
          <th className="px-3 sm:px-4 py-2 text-left">Description</th>
          <th className="px-3 sm:px-4 py-2 text-left">Restaurant</th>
          <th className="px-3 sm:px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((m) => (
          <tr key={m.id} className="border-b hover:bg-blue-50 transition-colors">
            <td className="px-3 sm:px-4 py-2">{m.id}</td>
            <td className="px-3 sm:px-4 py-2">
              {m.imageUrl ? <img src={`http://localhost:8080${m.imageUrl}`} alt="Menu" className="w-16 h-16 object-cover mx-auto rounded" /> : "-"}
            </td>
            <td className="px-3 sm:px-4 py-2">{m.name}</td>
            <td className="px-3 sm:px-4 py-2">Rp {m.price}</td>
            <td className="px-3 sm:px-4 py-2">{m.description}</td>
            <td className="px-3 sm:px-4 py-2">{m.restaurant?.name}</td>
            <td className="px-3 sm:px-4 py-2 flex justify-center gap-2">
              <button onClick={() => openModal(m)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded flex items-center justify-center transition">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Card list for mobile */}
  <div className="md:hidden flex flex-col gap-4">
    {filtered.length === 0 && (
      <p className="text-center text-gray-500 py-4">No menus found.</p>
    )}
    {filtered.map((m) => (
      <div key={m.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        {m.imageUrl && <img src={`http://localhost:8080${m.imageUrl}`} alt="Menu" className="w-full h-32 object-cover rounded mb-2" />}
        <p><span className="font-semibold">ID:</span> {m.id}</p>
        <p><span className="font-semibold">Name:</span> {m.name}</p>
        <p><span className="font-semibold">Price:</span> Rp {m.price}</p>
        <p><span className="font-semibold">Description:</span> {m.description}</p>
        <p><span className="font-semibold">Restaurant:</span> {m.restaurant?.name}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => openModal(m)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded flex items-center justify-center transition">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Modal */}
  <AnimatePresence>
    {isModalOpen && (
      <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-md" initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }} transition={{ duration: 0.3 }}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">{editId ? "Edit Menu" : "Add Menu"}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base" required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base" required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base" required />
            <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base" required>
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
            </select>
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded mx-auto" />}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button type="button" onClick={closeModal} className="px-3 sm:px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto">Cancel</button>
              <button type="submit" className="px-3 sm:px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base w-full sm:w-auto">{editId ? "Update" : "Add"}</button>
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
