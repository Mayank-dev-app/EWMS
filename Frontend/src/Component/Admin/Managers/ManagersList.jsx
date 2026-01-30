import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserCog,
  Mail,
  Phone,
  Building,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";
import { useAuth } from "../../Hooks/AuthContext";

const ManagersList = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user, logout } = useAuth();

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      // 🚨 If token missing → logout
      if (!user?.token) {
        logout();
        return;
      }

      try {
        const res = await api.get("/admin/managers/list", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setManagers(res.data.managers);
      } catch (err) {
        console.error("Manager List Error:", err);

        if (err.response) {
          if (err.response.status === 401) {
            // 🔴 Unauthorized → force logout
            alert("Session expired! Please login again.");
            logout();
            return;
          }

          if (err.response.status === 403) {
            setError("Access Denied! You are not authorized.");
            setTimeout(() => navigate("/login"), 1500);
            return;
          }
        }

        setError("Failed to load manager list.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [user, logout, navigate]); // ⭐ dependencies correct

  // ⏳ Loading Screen
  if (loading) {
    return (
      <div className="text-center text-xl font-semibold mt-10">
        Loading Managers...
      </div>
    );
  }

  // ❌ Error Screen
  if (error) {
    return (
      <div className="text-center text-red-500 text-xl font-semibold mt-10">
        {error}
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Managers List
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`overflow-x-auto shadow-xl rounded-2xl ${
          darkMode ? "bg-slate-800" : "bg-white"
        }`}
      >
        <table className="min-w-full border-collapse">
          <thead
            className={`text-sm uppercase ${
              darkMode
                ? "bg-slate-700 text-gray-200"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <tr>
              <th className="p-4 text-left">Manager</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody
            className={`${
              darkMode ? "text-gray-200" : "text-gray-700"
            } font-medium`}
          >
            {managers.map((m, i) => (
              <motion.tr
                key={m._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`border-b ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        darkMode
                          ? "bg-slate-900 text-blue-300"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <UserCog size={20} />
                    </div>
                    <span>{m.name}</span>
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    {m.email}
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    {m.phone}
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Building size={18} />
                    {m.department?.name || "N/A"}
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      navigate(`/admin/managers/edit/${m._id}`)
                    }
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "bg-yellow-700 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <Pencil size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => alert(`Delete Manager: ${m.name}`)}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "bg-red-700 text-red-300"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ManagersList;
