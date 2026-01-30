import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";

const TrackPerformanceDetail = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const { task } = location.state || {};

  if (!task) {
    return (
      <div className="p-10">
        <p>No task data found!</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* BACK BUTTON */}
      <button
        className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl bg-blue-600 text-white"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">Task Details</h1>
      <p className="opacity-70 mb-8">Full progress breakdown of employee task</p>

      <div
        className={`p-6 rounded-3xl shadow-lg border ${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Task Name */}
        <h2 className="text-2xl font-bold mb-4">{task?.task}</h2>

        {/* Employee */}
        <p className="mb-2">
          <span className="font-semibold">Employee:</span>{" "}
          {task?.employee?.name || "Unknown"}
        </p>

        {/* Department */}
        <p className="mb-2">
          <span className="font-semibold">Department:</span>{" "}
          {task?.department?.name || task?.department || "N/A"}
        </p>

        {/* Status */}
        <p className="mb-2">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={
              task.status === "Completed"
                ? "text-green-500"
                : task.status === "In Progress"
                ? "text-blue-500"
                : "text-yellow-500"
            }
          >
            {task?.status}
          </span>
        </p>

        {/* Progress Description */}
        <div
          className={`mt-4 p-4 rounded-xl border ${
            darkMode
              ? "bg-slate-700 border-slate-600"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">Progress Report</h3>
          <p className="opacity-90">{task?.progress}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackPerformanceDetail;
