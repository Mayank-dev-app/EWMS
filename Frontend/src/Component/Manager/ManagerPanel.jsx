import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardPlus,
  CheckCircle,
  BarChart3,
  FileText,
  MessageCircle,
  Menu,
  Sun,
  Moon,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useTheme } from "../Hooks/DarkLight";

const ManagerLayout = () => {
  const [open, setOpen] = React.useState(true);
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: BarChart3, path: "/manager/dashboard" },
    { name: "Assign Task", icon: ClipboardPlus, path: "/manager/assign-task" },
    { name: "Approvals", icon: CheckCircle, path: "/manager/approve-work" },
    { name: "Performance", icon: UserCheck, path: "/manager/track-performance" },
    { name: "Reports", icon: FileText, path: "/manager/task-reports" },
  ];

  // Detect if we are on the main manager path
  const showWelcome =
    location.pathname === "/manager" ||
    location.pathname === "/manager/";

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <motion.div
        animate={{ width: open ? 260 : 90 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`p-4 h-full flex flex-col border-r shadow-2xl ${
          darkMode
            ? "bg-slate-800 border-white/20 text-white"
            : "bg-blue-700 text-white"
        }`}
      >
        {/* Top */}
        <div className="flex items-center justify-between mb-10">
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className="cursor-pointer"
          >
            <Menu size={open ? 28 : 30} />
          </motion.div>

          {open && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition cursor-pointer"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          )}
        </div>

        {/* Title */}
        {open && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold tracking-wide mb-6"
          >
            Manager
          </motion.h1>
        )}

        {/* Nav Items */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.03 }}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-700 font-semibold shadow-lg"
                      : "text-white/80 hover:bg-white/20"
                  }`
                }
                style={{
                  justifyContent: open ? "flex-start" : "center",
                  paddingLeft: open ? 16 : 12,
                  gap: open ? 16 : 0,
                }}
              >
                <item.icon size={open ? 22 : 26} />
                {open && item.name}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-auto text-red-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-600/20 text-center"
        >
          {open ? "Logout" : <LogOut size={26} />}
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
          darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-black"
        }`}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Welcome Content */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto text-center py-16"
          >
            <h1 className="text-4xl font-bold mb-4">
              Welcome, Manager! 👋
            </h1>
            <p className="text-lg opacity-80 mb-8">
              Use the sidebar to manage tasks, review approvals, track employee
              performance, and oversee reports easily.
            </p>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20"
            >
              <p className="text-xl font-semibold mb-2">
                Your workspace is ready.
              </p>
              <p className="opacity-70">
                Select any option from the left menu to get started.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Renders child pages */}
        <Outlet />
      </motion.div>
    </div>
  );
};

export default ManagerLayout;
