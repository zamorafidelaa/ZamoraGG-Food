import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Utensils, X, ShoppingCart, Search } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getMenuImageUrl = (imageUrl) => {
  if (!imageUrl) return "/food-placeholder.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

const Menu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedResto, setSelectedResto] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [restoSearch, setRestoSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [menuSortOption, setMenuSortOption] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cartAnimation, setCartAnimation] = useState(null);

  const userId = localStorage.getItem("userId");
  const CART_TARGET = { x: window.innerWidth - 60, y: 20 };

  useEffect(() => {
    fetch(`${API_BASE_URL}/restaurants`)
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));

    fetch(`${API_BASE_URL}/menus/get`)
      .then((res) => res.json())
      .then((data) => setMenus(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = async (menu, e) => {
    if (!userId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setCartAnimation({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      key: Date.now(),
    });

    try {
      await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: parseInt(userId, 10) },
          menu: { id: menu.id },
          quantity: 1,
        }),
      });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const filteredRestaurants = restaurants.filter((resto) =>
    resto.name.toLowerCase().includes(restoSearch.toLowerCase())
  );

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "address-asc") return (a.address || "").localeCompare(b.address || "");
    if (sortOption === "address-desc") return (b.address || "").localeCompare(a.address || "");
    return 0;
  });

  let restoMenus = selectedResto
    ? menus.filter(
        (menu) =>
          menu.restaurant?.id === selectedResto.id &&
          menu.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : [];

  restoMenus = [...restoMenus].sort((a, b) => {
    if (menuSortOption === "name-asc") return a.name.localeCompare(b.name);
    if (menuSortOption === "name-desc") return b.name.localeCompare(a.name);
    if (menuSortOption === "price-asc") return a.price - b.price;
    if (menuSortOption === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen pb-24">
      {!selectedResto && (
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-8 flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          <Utensils size={28} className="text-blue-500" />
          Explore Restaurants
        </h1>
      )}

      {/* Cart animation */}
      <AnimatePresence>
        {cartAnimation && (
          <motion.div
            key={cartAnimation.key}
            initial={{ x: cartAnimation.x, y: cartAnimation.y, scale: 1, opacity: 1 }}
            animate={{ x: CART_TARGET.x, y: CART_TARGET.y, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={() => setCartAnimation(null)}
            className="fixed z-50 text-blue-500 pointer-events-none"
          >
            <ShoppingCart size={32} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restaurants list */}
      {!selectedResto ? (
        <div>
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="relative w-full sm:w-1/2 md:w-1/3">
              <input
                type="text"
                value={restoSearch}
                onChange={(e) => setRestoSearch(e.target.value)}
                placeholder="Search restaurant..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-full sm:w-48"
            >
              <option value="">Sort by...</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="address-asc">Address (A–Z)</option>
              <option value="address-desc">Address (Z–A)</option>
            </select>
          </div>

          {/* Restaurant grid */}
          {sortedRestaurants.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">No restaurants found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sortedRestaurants.map((resto) => (
                <motion.div
                  key={resto.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 border border-gray-200 hover:shadow-xl"
                  onClick={() => setSelectedResto(resto)}
                >
                  <div className="p-5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{resto.name}</h2>
                    {resto.address && (
                      <p className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <MapPin size={16} className="text-blue-500" /> {resto.address}
                      </p>
                    )}
                    {resto.phone && (
                      <p className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={16} className="text-green-500" /> {resto.phone}
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
        /* Menu list */
        <div>
          <button
            onClick={() => setSelectedResto(null)}
            className="mb-6 text-blue-500 font-semibold underline cursor-pointer"
          >
            ← Back to Restaurants
          </button>

          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            {selectedResto.name}'s Menu 🍽️
          </h2>

          {/* Search + Sort menu */}
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="relative w-full sm:w-1/2 md:w-1/3">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={menuSortOption}
              onChange={(e) => setMenuSortOption(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-full sm:w-48"
            >
              <option value="">Sort menu by...</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
            </select>
          </div>

          {/* Menu grid */}
          {restoMenus.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">No menu found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {restoMenus.map((menu, index) => (
                <motion.div
                  key={menu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
                >
                  <div className="relative w-full h-40 sm:h-48 md:h-56 overflow-hidden rounded-t-2xl">
                    <img
                      src={getMenuImageUrl(menu.imageUrl)}
                      alt={menu.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedMenu(menu)}
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-900">{menu.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm px-2 py-1 bg-blue-100 rounded-full inline-block shadow-sm max-w-max truncate">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 w-full border border-blue-500 bg-transparent text-blue-500 py-2 rounded-xl font-semibold shadow-sm hover:bg-blue-100 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      onClick={(e) => addToCart(menu, e)}
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu detail modal */}
      <AnimatePresence>
        {selectedMenu && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
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
              <button
                className="absolute top-4 right-4 bg-white p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={() => setSelectedMenu(null)}
              >
                <X size={24} />
              </button>

              <div className="w-full flex items-center justify-center bg-white rounded-xl mb-4">
                <img
                  src={getMenuImageUrl(selectedMenu.imageUrl)}
                  alt={selectedMenu.name}
                  className="max-h-[300px] object-contain"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedMenu.name}</h3>
              <p className="text-blue-600 font-semibold text-lg mb-4 truncate">
                Rp {selectedMenu.price.toLocaleString("id-ID")}
              </p>

              <p className="text-gray-600 mb-6">
                {selectedMenu.description || "No description available"}
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full border border-blue-500 bg-transparent text-blue-500 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-100 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                onClick={(e) => {
                  addToCart(selectedMenu, e);
                  setSelectedMenu(null);
                }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
