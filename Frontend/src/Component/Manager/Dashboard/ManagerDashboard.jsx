// ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import {
  Users,
  ClipboardList,
  BarChart3,
  ClipboardPlus,
  UserCheck,
  PackageCheck,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // your axios instance

const ManagerDashboard = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    tasksToday: 0,
  });

  const [performance, setPerformance] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);


  // ---------------------------
  // FETCH DASHBOARD SUMMARY
  // ---------------------------
  const fetchSummary = async () => {
    try {
      const res = await api.get("/manager/dashboard-summary");
      if (res.data.success) {
        setSummary({
          totalEmployees: res.data.data.totalEmployees || 0,
          totalDepartments: res.data.data.totalDepartments || 0,
          totalTasks: res.data.data.totalTasks || 0,
        });
      }
    } catch (err) {
      console.log("Error fetching summary:", err);
    }
  };

  // ---------------------------
  // FETCH EMPLOYEE PERFORMANCE
  // ---------------------------
  const fetchPerformance = async () => {
    try {
      const res = await api.get("/manager/employee-performance");
      if (res.data.success) {
        setPerformance(res.data.data || []); // Fallback to empty array
      }
    } catch (err) {
      console.log("Error fetching performance:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchPerformance();
  }, []);

  return (
    <div className="min-h-screen space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* LEFT SIDE TITLE */}
        <h2
          className={`text-3xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-black"
            }`}
        >
          <BarChart3 className="text-indigo-400" /> Manager Dashboard
        </h2>

        {/* RIGHT SIDE LIVE CLOCK */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          whileHover={{ rotateY: 8, rotateX: 5, scale: 1.05 }}
          className={`relative px-6 py-3 rounded-2xl cursor-default shadow-lg backdrop-blur-xl border flex items-center gap-3 select-none ${darkMode
            ? "bg-white/10 border-white/20 text-blue-300 shadow-blue-500/20"
            : "bg-white/40 border-gray-300 text-blue-700 shadow-blue-300/30"
            }`}
          style={{ transformStyle: "preserve-3d", perspective: "800px" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="z-10"
          >
            <Clock size={26} className="text-blue-400" />
          </motion.div>

          <span className="text-lg font-bold tracking-wide z-10">
            {time}
          </span>
        </motion.div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Employees",
            value: summary.totalEmployees,
            icon: Users,
            color: "bg-indigo-500/20 text-indigo-400",
          },
          {
            title: "Departments",
            value: summary.totalDepartments,
            icon: ClipboardList,
            color: "bg-green-500/20 text-green-400",
            path: "/manager/dashboard/deptby-task",
          },
          {
            title: "Tasks Today",
            value: `${summary.totalTasks} Assigned`,
            icon: ClipboardPlus,
            color: "bg-orange-500/20 text-orange-400",
            path: "/manager/dashboard/current-task",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 border rounded-2xl shadow-lg backdrop-blur ${darkMode
              ? "bg-slate-800/60 border-slate-700 text-white"
              : "bg-white border-gray-200 text-black"
              }`}
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => item.path && navigate(item.path)}
            >
              <div className={`p-4 rounded-xl ${item.color}`}>
                <item.icon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-500"
                    } text-lg`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3
          className={`text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"
            }`}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Assign Task",
              icon: ClipboardPlus,
              color: "text-indigo-400",
              path: "/manager/assign-task",
            },
            {
              title: "Approve Work",
              icon: PackageCheck,
              color: "text-green-400",
              path: "/manager/approve-work",
            },
            {
              title: "Track Performance",
              icon: UserCheck,
              color: "text-orange-400",
              path: "/manager/track-performance",
            },
            {
              title: "View Reports",
              icon: BarChart3,
              color: "text-blue-400",
              path: "/manager/reports",
            },
          ].map((action, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(action.path)}
              className={`flex cursor-pointer items-center justify-center gap-3 p-5 rounded-2xl shadow-lg border ${darkMode
                ? "bg-slate-800/60 border-slate-700"
                : "bg-white border-gray-200"
                } hover:opacity-90 transition`}
            >
              <action.icon size={26} className={action.color} />
              <span
                className={`${darkMode ? "text-white" : "text-black"
                  } text-lg font-medium`}
              >
                {action.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Performance */}
        <motion.div className={`p-6 border rounded-2xl shadow-lg backdrop-blur ${darkMode ? "bg-slate-800/60 border-slate-700 text-white" : "bg-white border-gray-200 text-black"}`}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="text-indigo-400" /> Employee Performance
          </h3>

          <div className="space-y-4">
            {performance?.length > 0 ? (
              // Show top 3 performers only
              performance.slice(0, 3).map((emp, idx) => (
                <div key={idx} className={`flex justify-between items-center p-4 rounded-xl border ${darkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`${darkMode ? "text-white" : "text-black"} text-lg font-medium`}>
                    {emp.name}
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {emp.completedTasks || 0} tasks completed
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No performance data found</p>
            )}

            {/* View All Button */}
            {performance.length > 3 && (
              <button
                onClick={() => navigate("/manager/track-performance")}
                className="mt-3 w-full py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                View All
              </button>
            )}
          </div>
        </motion.div>


        {/* Pending Approvals */}
        <motion.div
          className={`p-6 border rounded-2xl shadow-lg backdrop-blur ${darkMode
            ? "bg-slate-800/60 border-slate-700 text-white"
            : "bg-white border-gray-200 text-black"
            }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="text-orange-400" /> Pending Approvals
          </h3>

          <div className="space-y-4">
            {[
              "Leave request from Priya Gupta",
              "Attendance correction for Ravi Kumar",
              "Shift change request from Suresh Verma",
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center p-4 rounded-xl border ${darkMode
                  ? "bg-slate-700/50 border-slate-600"
                  : "bg-gray-50 border-gray-200"
                  }`}
              >
                <p className={`${darkMode ? "text-white" : "text-black"}`}>
                  {item}
                </p>
                <button className="text-indigo-400 hover:underline text-sm">
                  Review
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
