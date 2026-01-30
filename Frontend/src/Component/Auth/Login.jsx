import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  // ⭐ USE CONTEXT LOGIN

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });

      alert(response.data.message);

      // ⭐ FIX: Use AuthContext login()
      login({
        token: response.data.token,
        role: response.data.user.role,
        email: response.data.user.email,
      });

      const userRole = response.data.user.role;

      // ❌ No role found
      if (!userRole) {
        alert("User role not assigned. Contact admin.");
        return;
      }

      // 🎯 VALID ROLES CHECK
      if (userRole === "Admin") {
        navigate("/admin/dashboard");
      }
      else if (userRole === "Manager") {
        navigate("/manager/dashboard");
      }
      else if (
        userRole === "employee" ||
        userRole === "Software Developer" ||
        userRole === "Sales Executive" ||
        userRole === "HR" ||
        userRole === "Accountant" ||
        userRole === "Designer" ||
        userRole === "Technician"
      ) {
        // ⭐ ALL EMPLOYEE-TYPE ROLES
        navigate("/employee/dashboard");
      }
      else {
        // ❌ Invalid role (Security check)
        alert("Invalid user role. Access denied.");
        return;
      }

    } catch (error) {
      console.log("Error:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Email */}
        <label className="text-sm font-medium">Email</label>
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            className="w-full mt-1 pl-10 p-3 border rounded-xl focus:outline-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <label className="text-sm font-medium">Password</label>
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            className="w-full mt-1 pl-10 p-3 border rounded-xl focus:outline-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Forgot your password?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/forget-password")}
          >
            Reset
          </span>
        </p>
      </motion.div>
    </div>
  );
}
