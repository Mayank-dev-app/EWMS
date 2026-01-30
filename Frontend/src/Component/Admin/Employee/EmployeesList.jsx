import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  User,
  Mail,
  Briefcase,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";

const EmployeeList = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // FETCH EMPLOYEES FROM BACKEND
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/admin/employees-list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEmployees(res.data.employees);
      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // FILTER EMPLOYEES (SEARCH + STATUS)
  const filteredEmployees = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === "Active") return e.status === "Active" && matchSearch;
    if (filterStatus === "Inactive") return e.status === "Inactive" && matchSearch;
    return matchSearch;
  });

  // DELETE EMPLOYEE API
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/employee/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI instantly
      setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId));

      setShowDeleteModal(false);
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-black"
        }`}
    >
      {/* FILTER CIRCLES */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setFilterStatus("All")}
          className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-md transition ${filterStatus === "All"
            ? "bg-indigo-600 text-white"
            : darkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-black"
            }`}
        >
          <span className="text-xl font-bold">{employees.length}</span>
          <span className="text-sm font-medium">All</span>
        </button>

        <button
          onClick={() => setFilterStatus("Active")}
          className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-md transition ${filterStatus === "Active"
            ? "bg-green-600 text-white"
            : darkMode
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-700"
            }`}
        >
          <span className="text-xl font-bold">
            {employees.filter((e) => e.status === "Active").length}
          </span>
          <span className="text-sm font-medium">Active</span>
        </button>

        <button
          onClick={() => setFilterStatus("Inactive")}
          className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-md transition ${filterStatus === "Inactive"
            ? "bg-red-600 text-white"
            : darkMode
              ? "bg-red-900 text-red-300"
              : "bg-red-100 text-red-700"
            }`}
        >
          <span className="text-xl font-bold">
            {employees.filter((e) => e.status === "Inactive").length}
          </span>
          <span className="text-sm font-medium">Inactive</span>
        </button>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold font-serif">Employee List</h2>

        <button
          onClick={() => navigate("/admin/employees/add")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6 w-full md:w-1/2">
        <Search
          className={`absolute left-3 top-3 ${darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          size={20}
        />
        <input
          type="text"
          placeholder="Search employees..."
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-xl shadow-sm outline-none transition
            ${darkMode
              ? "bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400"
              : "bg-white border border-gray-300 text-gray-900"
            }
            focus:ring focus:ring-indigo-300`}
        />
      </div>

      {/* EMPLOYEE CARDS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((emp) => (
          <motion.div
            key={emp._id}
            whileHover={{ scale: 1.03, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`p-5 rounded-2xl shadow transition border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
              }`}
          >
            {/* NAME */}
            <div className="flex items-center gap-3 mb-3">
              <User size={22} className="text-indigo-600" />
              <h3 className={`${darkMode ? "text-white" : "text-black"} text-xl font-semibold`}>
                {emp.name}
              </h3>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-3">
              <Mail size={18} className={`${darkMode ? "text-gray-300" : "text-black"} opacity-80`} />
              <span className={`${darkMode ? "text-white" : "text-black"}`}>{emp.email}</span>
            </div>

            {/* ROLE */}
            <div className="flex items-center gap-3 mt-1">
              <Briefcase size={18} className={`${darkMode ? "text-gray-300" : "text-black"}`} />
              <span className={`${darkMode ? "text-gray-200" : "text-orange-600"}`}>{emp.role}</span>
            </div>

            {/* STATUS */}
            <div className="mt-3">
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${emp.status === "Active"
                    ? darkMode
                      ? "bg-green-900 text-green-300"
                      : "bg-green-100 text-green-700"
                    : darkMode
                      ? "bg-red-900 text-red-300"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {emp.status}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-7 mt-5 justify-end">
              <button
                onClick={() => navigate(`/admin/employees/view/${emp._id}`)}
                className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center gap-2"
              >
                <Eye size={18} /> View
              </button>

              <button
                onClick={() => navigate(`/admin/employees/edit/${emp._id}`)}
                className="cursor-pointer px-3 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 flex items-center gap-2"
              >
                <Pencil size={18} /> Edit
              </button>

              {/* <button
                onClick={() => {
                  setDeleteId(emp._id);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete
              </button> */}
            </div>
          </motion.div>

        ))}
      </div>



      {/* DELETE MODAL
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div
            className={`p-6 rounded-xl shadow-lg w-80 transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this employee?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`px-4 py-2 rounded-lg transition ${darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default EmployeeList;
