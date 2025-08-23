import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/image.png"; // replace with smooth illustration

const API_BASE = "http://localhost:8080/users";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setMessage(errData.message || "Login failed");
        return;
      }

      const data = await res.json();
      setMessage(data.message);

      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);

      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "CUSTOMER") navigate("/");
      else if (data.role === "COURIER") navigate("/courier/home");
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-4">
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Image section - always visible */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-8">
          <img
            src={image}
            alt="Illustration"
            className="w-3/4 md:w-4/5 drop-shadow-2xl rounded-2xl"
          />
        </div>

        {/* Form section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-b from-blue-50 to-blue-100">
          <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
            Welcome Back
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email address"
              className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition bg-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition bg-white/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Sign In
            </motion.button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">Don’t have an account?</p>
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
