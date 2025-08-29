import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setProfile(data.data);
      })
      .catch(() => setMessage("Failed to load user profile"));
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/users/${userId}/address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        street: profile.street,
        city: profile.city,
        postalCode: profile.postalCode,
        phone: profile.phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Address updated successfully!");
      })
      .catch(() => setMessage("Failed to update address"));
  };

  return (
    <div className="max-w-md mx-auto mt-15 mb-15 p-6 bg-white shadow-md rounded-xl border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        My Profile
      </h2>

      {message && (
        <p className="text-center mb-3 text-sm text-green-600 font-medium">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            disabled
            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Street</label>
          <input
            type="text"
            name="street"
            value={profile.street || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-600">City</label>
          <input
            type="text"
            name="city"
            value={profile.city || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={profile.postalCode || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default Profile;
