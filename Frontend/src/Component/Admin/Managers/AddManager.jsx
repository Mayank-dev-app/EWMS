import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";

const AddManager = () => {
  const { darkMode } = useTheme(); // THEME HOOK ADDED

  return (
    <div
      className={`p-6 flex justify-center min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-xl rounded-2xl p-8 shadow-2xl transition-all ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Add New Manager
        </motion.h1>

        {/* FORM */}
        <form className="space-y-5">

          {/* Manager Name */}
          <div>
            <label className="block font-medium mb-1">Manager Name</label>
            <div
              className={`flex items-center gap-3 border px-4 py-3 rounded-xl transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus-within:border-indigo-400"
                  : "bg-gray-50 border-gray-300 focus-within:border-indigo-500"
              }`}
            >
              <User className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter manager name"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email Address</label>
            <div
              className={`flex items-center gap-3 border px-4 py-3 rounded-xl transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus-within:border-indigo-400"
                  : "bg-gray-50 border-gray-300 focus-within:border-indigo-500"
              }`}
            >
              <Mail className="text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Enter email"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <div
              className={`flex items-center gap-3 border px-4 py-3 rounded-xl transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus-within:border-indigo-400"
                  : "bg-gray-50 border-gray-300 focus-within:border-indigo-500"
              }`}
            >
              <Phone className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="+91 XXXXX XXXXX"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block font-medium mb-1">Department</label>
            <div
              className={`flex items-center gap-3 border px-4 py-3 rounded-xl transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus-within:border-indigo-400"
                  : "bg-gray-50 border-gray-300 focus-within:border-indigo-500"
              }`}
            >
              <Building className="text-gray-400" size={20} />
              <select
                className={`w-full bg-transparent outline-none ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                <option>Select Department</option>
                <option>HR</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>IT</option>
                <option>Finance</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-medium shadow-md hover:bg-indigo-700 transition"
          >
            Add Manager
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddManager;
