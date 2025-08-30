import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isValid, setIsValid] = useState(false);

  const [touched, setTouched] = useState({ email: false, password: false });

  const validateInputs = () => {
    let newErrors = { email: "", password: "" };

    if (!email.endsWith("@gmail.com")) {
      newErrors.email = "Email must be a valid @gmail.com address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (password.length > 12) {
      newErrors.password = "Password must not exceed 12 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  useEffect(() => {
    setIsValid(validateInputs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      setTouched({ email: true, password: true });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
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
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base opacity-80"
          >
            Please sign in to continue
          </motion.p>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-blue-300 flex items-center justify-center rounded-lg mb-2 shadow-md">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <h1 className="text-xl font-bold text-blue-500">LOGIN</h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="email"
                  placeholder="Enter your Gmail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              {touched.password && errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={isValid ? { scale: 1.05 } : {}}
              whileTap={isValid ? { scale: 0.97 } : {}}
              type="submit"
              disabled={!isValid}
              className={`py-2 rounded-full font-semibold shadow-md transition text-sm ${
                isValid
                  ? "bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              LOGIN
            </motion.button>
          </form>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`mt-4 text-center font-medium text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </motion.p>
          )}

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
