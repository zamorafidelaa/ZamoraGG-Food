import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

const API_BASE = "http://localhost:8080/users";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("Registration failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <motion.div
        className="flex w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left side gradient */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-100 to-blue-300 flex-col items-center justify-center text-blue-900 text-center p-6">
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
            Create your new account and join us!
          </motion.p>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="flex flex-col items-center mb-6">
            {/* Logo */}
            <div className="w-14 h-14 bg-blue-300 flex items-center justify-center rounded-lg mb-2 shadow-md">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-blue-500">REGISTER</h1>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex items-center border-b border-gray-300 py-2">
              <User className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-full font-semibold shadow-md transition text-sm"
            >
              SIGN UP
            </motion.button>
          </form>

          {/* pesan sukses/gagal */}
          {message && (
            <p
              className={`mt-4 text-center font-medium text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* link ke login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
