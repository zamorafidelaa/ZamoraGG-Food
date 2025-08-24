import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../assets/image.png";

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
      else if (data.role === "COURIER") navigate("/courier/home");

      // Trigger storage event untuk update header & cart
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-8">
          <img src={image} alt="Illustration" className="w-3/4 md:w-4/5 drop-shadow-2xl rounded-2xl" />
        </div>
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-b from-blue-50 to-blue-100">
          <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Welcome Back</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-3 rounded-xl" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-3 rounded-xl" />
            <button type="submit" className="bg-blue-500 text-white py-3 rounded-xl">Sign In</button>
          </form>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
          <div className="mt-8 text-center">
            <Link to="/register" className="text-blue-600 font-semibold">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
