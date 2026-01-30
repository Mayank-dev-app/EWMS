import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import { User, Settings2, Clock, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // 👉 YOUR AXIOS INSTANCE

const DailyProgress = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 👉 FETCH ALL TASKS API — On page load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/manager/tasks"); // 🔥 your API endpoint
        setTasks(res.data.tasks);  // your backend response { tasks: [...] }
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 👉 Search filter
  const filteredTasks = tasks.filter((t) => {
    const taskName = t?.task?.toLowerCase() || "";

    // employee name (object or string both)
    const empName =
      (t?.employee?.name || t?.employee || "")?.toString().toLowerCase();

    // department (object or string both)
    const dept =
      (t?.department?.name || t?.department || "")?.toString().toLowerCase();

    const search = searchTerm.toLowerCase();

    return (
      taskName.includes(search) ||
      empName.includes(search) ||
      dept.includes(search)
    );
  });

  return (
    <motion.div
      className={`min-h-screen p-6 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-1">Employee Daily Progress</h1>
      <p className="opacity-70 mb-8">
        Manager can only view employee progress. No edits allowed.
      </p>

      {/* SEARCH BAR */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search task, employee, department..."
          className={`w-full p-3 rounded-xl border shadow-sm ${darkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
            }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-lg opacity-70">Loading tasks...</p>
      )}

      {/* ERROR */}
      {!loading && error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* TASK LIST */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredTasks.map((t, index) => {
            const statusColor =
              t.status === "Completed"
                ? "text-green-500"
                : t.status === "In Progress"
                  ? "text-blue-500"
                  : "text-yellow-500";

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between ${darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    {t.title || t.task || "Untitled Task"}
                  </h2>
                  <p className="flex items-center gap-2 opacity-80 mb-2 text-sm">
                    <User size={16} />
                    {t?.employee?.name || t?.employee || "Unknown"} —{" "}
                    <span className="font-medium">
                      {t?.department?.name || t?.department || "N/A"}
                    </span>
                  </p>

                  <p
                    className={`font-semibold mb-3 flex items-center gap-2 ${statusColor}`}
                  >
                    <Settings2 size={16} />
                    {t.status}
                  </p>

                  <p className="text-sm mb-4 flex items-center gap-2 opacity-70">
                    <Clock size={16} /> Last Updated:{" "}
                    {new Date(t.updatedAt).toLocaleDateString()}
                  </p>

                  {/* <div
                    className={`p-3 rounded-xl border text-sm ${darkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-900"
                      }`}
                  >
                    {t.progress || "No progress added yet"}
                  </div> */}
                </div>

                {/* BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium shadow-md ${darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                    }`}
                  onClick={() =>
                    navigate("/manager/track-performance/detail", {
                      state: { task: t },
                    })
                  }
                >
                  View Details <ArrowRightCircle size={18} />
                </motion.button>
              </motion.div>
            );
          })}

          {filteredTasks.length === 0 && (
            <p className="text-center col-span-full mt-6 opacity-70">
              No tasks found matching "{searchTerm}"
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DailyProgress;
