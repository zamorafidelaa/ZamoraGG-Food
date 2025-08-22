import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Delivery Food</h1>
      <p className="text-gray-600 mb-6 text-center">
        Manage your restaurants, orders, and users efficiently.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Explore
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
