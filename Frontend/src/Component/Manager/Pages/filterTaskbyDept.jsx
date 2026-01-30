import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import { ArrowLeft, Filter, CheckCircle2, Clock, Workflow } from "lucide-react";
import api from "../../api/api";

const DepartmentFilteredTasks = () => {
  const { dept } = useParams();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (status = "All") => {
    try {
      setLoading(true);
      const res = await api.get(
        `/manager/tasks-by-department/${dept}`,
        {
          params: { status },
        }
      );

      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks("All");
  }, [dept]);

  const handleFilter = (status) => {
    setSelectedStatus(status);
    fetchTasks(status);
  };

  return (
    <motion.div
      className={`min-h-screen px-6 py-6 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back */}
      <button
        onClick={() => navigate("/manager/dashboard/deptby-task")}
        className="mb-6 flex items-center gap-2 hover:underline"
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{dept} – Task Details</h1>
      <p className="opacity-80 mb-6">
        View and filter all employee tasks in this department.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { name: "All", icon: Workflow },
          { name: "Pending", icon: Clock },
          { name: "In Progress", icon: Filter },
          { name: "Completed", icon: CheckCircle2 },
        ].map((btn) => (
          <button
            key={btn.name}
            onClick={() => handleFilter(btn.name)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 border shadow-sm transition
              ${selectedStatus === btn.name
                ? "bg-indigo-600 text-white"
                : darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-300"
              }`}
          >
            <btn.icon size={18} />
            {btn.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className={`rounded-2xl overflow-hidden shadow-xl border 
        ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
      >
        <table className="w-full text-left">
          <thead className={`${darkMode ? "bg-slate-700" : "bg-gray-200"}`}>
            <tr>
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 opacity-70">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                >
                  <td className="py-3 px-4">{t.title}</td>
                  <td className="py-3 px-4">{t.employee?.name}</td>
                  <td className="py-3 px-4 font-semibold">
                    <span
                      className={
                        t.status === "Completed"
                          ? "text-green-500"
                          : t.status === "Pending"
                            ? "text-yellow-500"
                            : "text-blue-500"
                      }
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(t.deadline).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DepartmentFilteredTasks;
