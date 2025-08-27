import React, { useEffect, useRef } from "react";
import { Utensils, ShoppingBag, Bike, Clock, Star, Shield } from "lucide-react";

const categories = [
  { id: 1, name: "Drinks", image: "https://i.pinimg.com/736x/55/2c/67/552c67aabfb8db3a152aa1c8310ea3b1.jpg" },
  { id: 2, name: "Snacks", image: "https://i.pinimg.com/1200x/a8/8a/02/a88a026aafbadfb9a5ae6dc579a1f999.jpg" },
  { id: 3, name: "Light Bites", image: "https://i.pinimg.com/736x/83/ff/3c/83ff3cf883bb8bde0f4c22a39a0332f8.jpg" },
  { id: 4, name: "Main Dishes", image: "https://i.pinimg.com/736x/26/53/45/2653455dc0da0cf9c6ee16ecef5f3eff.jpg" },
  { id: 5, name: "Desserts", image: "https://i.pinimg.com/1200x/23/cc/17/23cc176e7e967058152d2dcb51a5f7fc.jpg" },
  { id: 6, name: "Healthy & Salad", image: "https://i.pinimg.com/736x/08/c7/0d/08c70d473888e35bd1c4cd9d1d2983d7.jpg" },
  { id: 7, name: "Bakery & Cakes", image: "https://i.pinimg.com/1200x/d9/8a/c0/d98ac065b4e651488dae85021dfe58dd.jpg" },
  { id: 8, name: "Seafood", image: "https://i.pinimg.com/736x/64/af/a9/64afa9e9f836fcbbd0bf61ab0351f6eb.jpg" },
  { id: 9, name: "Fast Food", image: "https://i.pinimg.com/736x/23/96/dd/2396ddebe05f12861cf5cd378e4949b5.jpg" },
];

const CategoryCard = ({ category }) => {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          ref.current.classList.add("opacity-100", "translate-y-0", "scale-100");
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-3xl overflow-hidden relative shadow-lg opacity-0 translate-y-10 scale-95 transition-all duration-700 hover:scale-105 hover:shadow-2xl group"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center transition-all duration-700 group-hover:from-black/70">
        <h3 className="text-white text-2xl font-extrabold text-center drop-shadow-lg tracking-wide">
          {category.name}
        </h3>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="w-full flex flex-col overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/video.mp4"
          autoPlay
          loop
          muted
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            ZamoraGG <span className="text-blue-400">Food Delivery</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto">
            Order your favorite meals, track deliveries in real-time, and manage
            restaurants seamlessly with our all-in-one delivery platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition">
              <Utensils className="w-14 h-14 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Restaurants</h3>
              <p className="text-gray-700 text-md">Browse and manage a wide variety of restaurants with ease.</p>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition">
              <ShoppingBag className="w-14 h-14 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Orders</h3>
              <p className="text-gray-700 text-md">Place and track your orders in real-time, hassle-free.</p>
            </div>
            <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition">
              <Bike className="w-14 h-14 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Delivery</h3>
              <p className="text-gray-700 text-md">Fast and reliable delivery right to your doorstep.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full py-28 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
          Explore <span className="text-blue-600">Categories</span>
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-10 px-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="w-full py-28 bg-white">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900">
          Why Choose <span className="text-blue-600">ZamoraGG?</span>
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 text-center">
          <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <Clock className="w-14 h-14 text-blue-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast & On Time</h3>
            <p className="text-gray-600">Get your orders delivered right on time, no more long waits.</p>
          </div>
          <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <Star className="w-14 h-14 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Top Restaurants</h3>
            <p className="text-gray-600">We collaborate with trusted restaurants offering the best quality.</p>
          </div>
          <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <Shield className="w-14 h-14 text-green-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Safe & Reliable</h3>
            <p className="text-gray-600">Secure payments and 24/7 customer support to assist you anytime.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full py-28 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900">
          How It <span className="text-blue-600">Works</span>
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6 text-center">
          <div className="transition transform hover:-translate-y-2 hover:scale-105">
            <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-6 text-2xl font-bold shadow-lg">1</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Choose Your Meal</h3>
            <p className="text-gray-600">Explore categories and pick your favorite dishes.</p>
          </div>
          <div className="transition transform hover:-translate-y-2 hover:scale-105">
            <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-6 text-2xl font-bold shadow-lg">2</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Order & Pay</h3>
            <p className="text-gray-600">Add to cart, checkout, and pay with ease.</p>
          </div>
          <div className="transition transform hover:-translate-y-2 hover:scale-105">
            <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-6 text-2xl font-bold shadow-lg">3</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Enjoy Your Meal</h3>
            <p className="text-gray-600">Our couriers deliver fast, fresh, and safe to your door.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
