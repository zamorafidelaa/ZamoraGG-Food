import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Utensils, X } from "lucide-react";

// Helper untuk generate URL gambar menu
const getMenuImageUrl = (imageUrl) => {
  if (!imageUrl) return "/food-placeholder.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `http://localhost:8080${imageUrl}`;
};

const Menu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedResto, setSelectedResto] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [restoSearch, setRestoSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [menuSortOption, setMenuSortOption] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null); // ✅ popup
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  // Ambil data dari backend
  useEffect(() => {
    fetch("http://localhost:8080/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:8080/menus/get")
      .then((res) => res.json())
      .then((data) => setMenus(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Filter + Sort restaurants
  const filteredRestaurants = restaurants.filter((resto) =>
    resto.name.toLowerCase().includes(restoSearch.toLowerCase())
  );

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "address-asc")
      return (a.address || "").localeCompare(b.address || "");
    if (sortOption === "address-desc")
      return (b.address || "").localeCompare(a.address || "");
    return 0;
  });

  // Filter menu per restoran
  let restoMenus = selectedResto
    ? menus.filter(
        (menu) =>
          menu.restaurant?.id === selectedResto.id &&
          menu.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : [];

  // Sorting menu
  restoMenus = [...restoMenus].sort((a, b) => {
    if (menuSortOption === "name-asc") return a.name.localeCompare(b.name);
    if (menuSortOption === "name-desc") return b.name.localeCompare(a.name);
    if (menuSortOption === "price-asc") return a.price - b.price;
    if (menuSortOption === "price-desc") return b.price - a.price;
    return 0;
  });

  // ✅ Tambah ke cart backend
  const addToCart = async (menu) => {
    if (!userId) {
      setMessage("⚠️ You must login first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: parseInt(userId, 10) },
          menu: { id: menu.id },
          quantity: 1,
        }),
      });

      if (res.ok) {
        setMessage(`✅ ${menu.name} added to cart`);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        setMessage("❌ Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-24">
      {!selectedResto && (
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          <Utensils size={32} className="text-blue-500" />
          Explore Restaurants
        </h1>
      )}

      {/* Pesan singkat */}
      {message && (
        <p className="text-center text-sm text-green-600 mb-4">{message}</p>
      )}

      {!selectedResto ? (
        <div>
          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              value={restoSearch}
              onChange={(e) => setRestoSearch(e.target.value)}
              placeholder="Search restaurant..."
              className="px-4 py-2 w-full sm:w-80 rounded-xl border border-gray-300 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Sort by...</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="address-asc">Address (A–Z)</option>
              <option value="address-desc">Address (Z–A)</option>
            </select>
          </div>

          {/* Restaurant Grid */}
          {sortedRestaurants.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No restaurants found
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedRestaurants.map((resto) => (
                <motion.div
                  key={resto.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 border border-gray-200 hover:shadow-xl"
                  onClick={() => {
                    setSelectedResto(resto);
                    setSearchKeyword("");
                  }}
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {resto.name}
                    </h2>
                    {resto.address && (
                      <p className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <MapPin size={16} className="text-blue-500" />{" "}
                        {resto.address}
                      </p>
                    )}
                    {resto.phone && (
                      <p className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={16} className="text-green-500" />{" "}
                        {resto.phone}
                      </p>
                    )}
                    <button className="mt-4 w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer">
                      See Menu
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setSelectedResto(null);
              setSearchKeyword("");
            }}
            className="mb-6 text-blue-500 font-semibold underline cursor-pointer"
          >
            ← Back to Restaurants
          </button>

          {/* Menu Title */}
          <h2 className="text-3xl md:text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 leading-snug">
            {selectedResto.name}'s Menu 🍽️
          </h2>

          {/* Search + Sort menu */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 justify-center">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search menu..."
              className="px-4 py-2 w-full sm:w-80 rounded-xl border border-gray-300 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={menuSortOption}
              onChange={(e) => setMenuSortOption(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Sort menu by...</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
          </div>

          {/* Menu Grid */}
          {restoMenus.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No menu found for this restaurant
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {restoMenus.map((menu, index) => (
                <motion.div
                  key={menu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 cursor-pointer"
                  onClick={() => setSelectedMenu(menu)} // ✅ buka modal
                >
                  <div className="relative w-full h-44 sm:h-52 md:h-56 overflow-hidden rounded-t-2xl">
                    <img
                      src={getMenuImageUrl(menu.imageUrl)}
                      alt={menu.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {menu.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-3 px-3 py-1 bg-blue-100 rounded-full inline-block shadow-sm">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ✅ Popup Menu Detail */}
      <AnimatePresence>
        {selectedMenu && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              {/* Tombol close */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => setSelectedMenu(null)}
              >
                <X size={24} />
              </button>

              {/* Gambar */}
              <div className="w-full flex items-center justify-center bg-white rounded-xl mb-4">
                <img
                  src={getMenuImageUrl(selectedMenu.imageUrl)}
                  alt={selectedMenu.name}
                  className="max-h-[300px] object-contain"
                />
              </div>

              {/* Nama & Harga */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedMenu.name}
              </h3>
              <p className="text-blue-600 font-semibold text-lg mb-4">
                Rp {selectedMenu.price.toLocaleString("id-ID")}
              </p>

              {/* Deskripsi */}
              <p className="text-gray-600 mb-6">
                {selectedMenu.description || "No description available"}
              </p>

              {/* Add to Cart */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToCart(selectedMenu);
                  setSelectedMenu(null); // tutup modal
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Add to Cart
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
