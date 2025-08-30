import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/users`;

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validate = (field, value) => {
    let error = "";

    if (field === "name") {
      if (!value.trim()) error = "Full name is required";
      else if (value.length < 3) error = "Name must be at least 3 characters";
    }

    if (field === "email") {
      const gmailRegex = /^[^\s@]+@gmail\.com$/;
      if (!value.trim()) error = "Email is required";
      else if (!gmailRegex.test(value)) error = "Email must be a valid @gmail.com address";
    }

    if (field === "password") {
      if (!value.trim()) error = "Password is required";
      else if (value.length < 6) error = "Password must be at least 6 characters";
      else if (value.length > 12) error = "Password must not exceed 12 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (errors.name || errors.email || errors.password) {
      setMessage("Please fix the errors before submitting");
      return;
    }

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

        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-blue-300 flex items-center justify-center rounded-lg mb-2 shadow-md">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-blue-500">REGISTER</h1>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validate("name", e.target.value);
                  }}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validate("email", e.target.value);
                  }}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validate("password", e.target.value);
                  }}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={errors.name || errors.email || errors.password}
              className={`py-2 rounded-full font-semibold shadow-md transition text-sm ${
                errors.name || errors.email || errors.password
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
              }`}
            >
              SIGN UP
            </motion.button>
          </form>

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
