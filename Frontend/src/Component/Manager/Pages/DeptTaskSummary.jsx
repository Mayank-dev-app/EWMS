import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Axios instance

const DepartmentTaskSummary = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch department-wise tasks
  // -----------------------------
  const fetchTasks = async () => {
    try {
      const res = await api.get("/manager/department-task-summary");
      console.log(res.data.data)
      if (res.data.success) {
        setTasks(res.data.data); // Expected: [{ department, pending, inProgress, completed, total }]
      }
    } catch (err) {
      console.error("Error fetching department tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!tasks.length) return <p className="text-center mt-20">No tasks found</p>;

  return (
    <motion.div
      className={`min-h-screen p-6 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Department-wise Task Summary
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((dept, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 25px rgba(0,0,0,0.2)" }}
            className={`p-6 rounded-3xl shadow-xl backdrop-blur-xl border cursor-pointer
              ${darkMode ? "bg-slate-800/60 border-slate-700" : "bg-white/70 border-gray-200"}
            `}
            onClick={() => navigate(`/manager/dashboard/task-summary/${dept.department}`)}
          >
            {/* ICON BOX */}
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full w-16 h-16 flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-500 shadow-lg">
                <Building2 size={30} className="text-white" />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-bold text-center mb-4">{dept.department}</h2>

            {/* TOTAL */}
            <p className="text-center text-sm mb-4 opacity-80">
              Total Tasks: <span className="font-semibold">{dept.total}</span>
            </p>

            {/* BADGES */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between bg-yellow-100 dark:bg-yellow-700/40 p-3 rounded-xl">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-300">{dept.pending}</span>
              </div>

              <div className="flex justify-between bg-blue-100 dark:bg-blue-700/40 p-3 rounded-xl">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-300">{dept.inProgress}</span>
              </div>

              <div className="flex justify-between bg-green-100 dark:bg-green-700/40 p-3 rounded-xl">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-300">{dept.completed}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DepartmentTaskSummary;
