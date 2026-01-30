import React, { useState } from "react";
import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  Menu,
  LogOut,
  BriefcaseBusiness,
  BarChart3,
  ShieldCheck,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../Hooks/DarkLight";
import { useAuth } from "../Hooks/AuthContext";

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, name: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, name: "Employees", path: "/admin/employees" },
    { icon: Building2, name: "Departments", path: "/admin/departments" },
    { icon: ClipboardCheck, name: "Tasks", path: "/admin/tasks" },
    { icon: BriefcaseBusiness, name: "Managers", path: "/admin/managers" },
    // { icon: BarChart3, name: "Reports", path: "/admin/reports" },
    // { icon: ShieldCheck, name: "Access Control", path: "/admin/access-control" },
  ];

  return (
    <div
      className={`flex h-screen transition-all duration-300 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* SIDEBAR */}
      <div
        className={`p-4 flex flex-col shadow-xl transition-all duration-300 border-r
        ${open ? "w-64" : "w-20"}
        ${
          darkMode
            ? "bg-slate-800 border-white/20 text-white"
            : "bg-blue-700 text-white"
        }`}
      >
        {/* TOP SECTION */}
        <div className="flex items-center justify-between mb-10">
          <Menu
            size={28}
            onClick={() => setOpen(!open)}
            className="cursor-pointer"
          />

          {/* THEME TOGGLE */}
          {open && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition cursor-pointer"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          )}
        </div>

        {/* LOGO */}
        {open && <h1 className="text-2xl font-bold mb-8">Admin</h1>}

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-[17px] transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold shadow-md"
                    : "text-white/80 hover:bg-white/20"
                }`
              }
              style={{
                justifyContent: open ? "flex-start" : "center",
                gap: open ? 12 : 0,
              }}
            >
              <item.icon size={open ? 22 : 26} />
              {open && item.name}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div
          onClick={logout}
          className="mt-auto text-red-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-600/20 text-center"
        >
          {open ? "Logout" : <LogOut size={26} />}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
          darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {/* 🔥 Default: Redirect /admin → /admin/dashboard */}
        {location.pathname === "/admin" ? (
          <Navigate to="/admin/dashboard" replace />
        ) : (
          <Outlet context={{ darkMode }} />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
