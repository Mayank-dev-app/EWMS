import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import { Clock, Settings2, User, ChevronRight, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const CurrentTasks = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 FETCH CURRENT TASKS FROM API
  const fetchTasks = async () => {
    try {
      const res = await api.get("/manager/tasks");

      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-xl">
        Loading tasks...
      </div>
    );

  return (
    <motion.div
      className={`min-h-screen p-6 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-1">Current Tasks</h1>
      <p className="opacity-70 mb-8">View all ongoing and pending tasks.</p>

      {/* TASK LIST */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {tasks.map((task, index) => {
          const statusColor =
            task.status === "In Progress" ? "text-blue-500" : "text-yellow-500";

          return (
            <motion.div
              key={task._id}
              whileHover={{ scale: 1.03 }}
              className={`p-6 rounded-3xl border shadow-lg cursor-pointer 
                ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
              onClick={() =>
                navigate(`/manager/dashboard/current-task/task-detail/${task._id}`)
              }
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{task.task}  { task.title }</h2>
                <ChevronRight size={22} className="opacity-60" />
              </div>

              {/* EMPLOYEE */}
              <p className="flex items-center gap-2 opacity-80 mb-2 text-sm">
                <User size={16} /> Assigned to:{" "}
                <span className="font-medium">{task.employee?.name || "N/A"}</span>
              </p>

              {/* STATUS */}
              <p className={`font-semibold mb-3 flex items-center gap-2 ${statusColor}`}>
                <Settings2 size={16} />
                {task.status}
              </p>

              {/* DEADLINE */}
              <p className="text-sm mb-4 flex items-center gap-2 opacity-70">
                <Clock size={16} /> Deadline:{" "}
                <span className="font-semibold">{task.deadline}</span>
              </p>

              {/* PROGRESS BAR
              <div className="mb-4">
                <p className="text-sm mb-1 opacity-70">Progress</p>
                <div
                  className={`w-full h-3 rounded-lg ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
                >
                  <div
                    className="h-3 bg-blue-500 rounded-lg"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-right mt-1 opacity-70">
                  {task.progress}%
                </p>
              </div> */}

              {/* VIEW DETAILS BUTTON */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium shadow-md 
                  ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                onClick={() =>
                  navigate(`/manager/dashboard/current-task/task-detail/${task._id}`)
                }
              >
                View Details <ArrowRightCircle size={18} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CurrentTasks;
