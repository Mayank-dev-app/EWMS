import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Building2,
  Plus,
  Search,
  Users,
  Briefcase,
  ClipboardList,
  Settings,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";

const ICON_MAP = {
  Users,
  Briefcase,
  ClipboardList,
  Settings,
};

const DepartmentsList = () => {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // 🔥 Fetch departments from API
  // 🔥 Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/departments");

      setDepartments(res.data.departments || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 🔎 Search Filter
  const filtered = departments.filter((d) =>
    (d?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ❌ Handle Delete
  const handleDelete = () => {
    setDepartments(departments.filter((d) => d._id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div
      className={`p-6 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold font-serif flex items-center gap-2">
          <Building2 size={30} className="text-indigo-600" />
          Departments
        </h2>

        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-indigo-700 transition"
          onClick={() => navigate(`/admin/departments/add`)}
        >
          <Plus size={20} /> Add Department
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8 w-full md:w-1/2">
        <Search
          className={`absolute left-3 top-3 ${darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          size={20}
        />
        <input
          type="text"
          placeholder="Search departments..."
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-xl shadow-sm outline-none border transition 
            ${darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-indigo-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-200"
            }`}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-lg font-semibold mt-10">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No departments found</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept, index) => {
            const Icon = ICON_MAP[dept.icon] || Users;
            return (
              <motion.div
                key={dept._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`p-6 rounded-2xl border shadow transition ${darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100 hover:shadow-gray-700"
                  : "bg-white border-gray-200 text-gray-900 hover:shadow-lg"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-xl ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-indigo-600"}`}
                    >
                      {dept.icon ? (
                        <img
                          src={dept.icon} // 🔥 Show department icon if available
                          alt={dept.name}
                          className="w-10 h-10 object-cover"
                        />
                      ) : (
                        <Icon size={28} /> // 🔥 Else default icon
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">{dept.name}</h3>
                      <p className="text-gray-500 text-sm">{dept.employeesCount || 0} Employees</p>
                    </div>
                  </div>

                  {/* Delete Button
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setDeleteId(dept._id)}
                  >
                    <Trash2 size={22} />
                  </button> */}
                </div>

                {/* View Button */}
                <button
                  className="w-full mt-3 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
                  onClick={() => navigate(`/admin/department/${dept._id}`)}
                >
                  View Details
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* DELETE POPUP
      {deleteId && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-2xl w-80 shadow-xl transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <h3 className="text-lg font-bold mb-2">Delete Department?</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete this department?
            </p>

            <div className="flex gap-3">
              <button
                className={`flex-1 py-2 rounded-lg border ${darkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-200"
                  }`}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )} */}
    </div>
  );
};

export default DepartmentsList;
