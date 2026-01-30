import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpdateTaskModal = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(60);
  const [status, setStatus] = useState("In Progress");

  return (
    <motion.div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-gray-300 dark:bg-slate-700 dark:text-white hover:opacity-80"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div
        className={`max-w-xl mx-auto p-6 rounded-3xl shadow-xl border ${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6">Update Task</h2>

        {/* STATUS */}
        <label className="text-sm opacity-70">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`w-full mt-2 p-3 rounded-xl border ${
            darkMode
              ? "bg-slate-700 border-slate-600"
              : "bg-gray-200 border-gray-300"
          }`}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* PROGRESS */}
        <label className="text-sm mt-6 opacity-70">Progress: {progress}%</label>
        <input
          type="range"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          min="0"
          max="100"
          className="w-full mt-2"
        />

        {/* BUTTON */}
        <button
          className="w-full mt-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md"
        >
          Save Changes
        </button>
      </motion.div>
    </motion.div>
  );
};

export default UpdateTaskModal;
