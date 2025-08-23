import React from "react";
import { Utensils, ShoppingBag, Bike } from "lucide-react";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Video with dark overlay */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        src="/video.mp4"
        autoPlay
        loop
        muted
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 -z-10"></div>

      {/* Hero Content */}
      <div className="text-center px-6 z-10 py-12 md:py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          ZamoraGG <span className="text-blue-400">Food Delivery</span>
        </h1>
        <p className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto">
          Order your favorite meals, track deliveries in real-time, and manage
          restaurants seamlessly with our all-in-one delivery platform.
        </p>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition">
            <Utensils className="w-14 h-14 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Restaurants</h3>
            <p className="text-gray-700 text-md">
              Browse and manage a wide variety of restaurants with ease.
            </p>
          </div>

          <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition">
            <ShoppingBag className="w-14 h-14 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Orders</h3>
            <p className="text-gray-700 text-md">
              Place and track your orders in real-time, hassle-free.
            </p>
          </div>

          <div className="bg-white/90 p-8 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition">
            <Bike className="w-14 h-14 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Delivery</h3>
            <p className="text-gray-700 text-md">
              Fast and reliable delivery right to your doorstep.
            </p>
          </div>
        </div>

        {/* Hero Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <a
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg cursor-pointer"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-100 transition shadow-lg cursor-pointer"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
