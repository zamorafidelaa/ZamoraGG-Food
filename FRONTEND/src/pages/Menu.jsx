import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../components/CartContext";
import { motion } from "framer-motion";
import { MapPin, Phone, Utensils } from "lucide-react";

const Menu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedResto, setSelectedResto] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [restoSearch, setRestoSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [menuSortOption, setMenuSortOption] = useState("");
  const { addToCart } = useContext(CartContext);

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

  // ✅ Filter + Sort restaurants
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

  // ✅ Filter menu berdasarkan restoran & search otomatis
  let restoMenus = selectedResto
    ? menus.filter(
        (menu) =>
          menu.restaurant?.id === selectedResto.id &&
          menu.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : [];

  // ✅ Sorting menu
  restoMenus = [...restoMenus].sort((a, b) => {
    if (menuSortOption === "name-asc") return a.name.localeCompare(b.name);
    if (menuSortOption === "name-desc") return b.name.localeCompare(a.name);
    if (menuSortOption === "price-asc") return a.price - b.price;
    if (menuSortOption === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        <Utensils size={32} className="text-blue-500" />
        Explore Restaurants
      </h1>

      {!selectedResto ? (
        <div>
          {/* 🔍 Search & Sort */}
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

          {/* ✅ Restaurant Grid */}
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
                    setSearchKeyword(""); // reset search menu
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

          {/* Modern Title */}
          <h2 className="text-4xl font-extrabold mb-8 text-center flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            {selectedResto.name}'s Menu 🍽️
          </h2>

          {/* 🔍 Search + Sort menu */}
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

          {/* ✅ Menu grid */}
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
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
                >
                  <div className="overflow-hidden">
                    <img
                      src={menu.imageUrl || "/food-placeholder.jpg"}
                      alt={menu.name}
                      className="w-full h-44 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {menu.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-3 px-3 py-1 bg-blue-100 rounded-full inline-block shadow-sm">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(menu)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
