import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

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

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);

      setMessage("Login successful!");

      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "CUSTOMER") navigate("/");
      else if (data.role === "COURIER") navigate("/courier");

      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <motion.div
        className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
{/* Left side gradient */}
<div className="w-1/2 bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center text-blue-900 text-center p-6">
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-3xl font-bold mb-2"
  >
    Welcome
  </motion.h2>
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.8 }}
    className="text-base opacity-80"
  >
    We’re glad to see you again
  </motion.p>
</div>

        {/* Right side form */}
        <div className="w-1/2 bg-white p-10">
          <div className="flex flex-col items-center mb-6">
            {/* Logo */}
            <div className="w-16 h-16 bg-blue-300 flex items-center justify-center rounded-lg mb-2 shadow-md">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-500">LOGIN</h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex items-center border-b border-gray-300 py-2">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-full font-semibold shadow-md transition"
            >
              LOGIN
            </motion.button>
          </form>

          {/* pesan sukses/gagal */}
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

          {/* link ke register */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
