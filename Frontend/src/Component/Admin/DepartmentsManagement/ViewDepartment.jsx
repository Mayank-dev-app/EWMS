import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Department Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/department/${id}`);
        setDepartment(res.data.department);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div
        className={`p-6 text-center text-xl ${darkMode ? "text-white" : "text-black"}`}
      >
        Loading...
      </div>
    );

  if (!department)
    return (
      <div
        className={`p-6 text-center text-xl font-bold ${
          darkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        Department Not Found
      </div>
    );

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 mb-6 hover:underline ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Dept Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-2xl shadow p-6 mb-8 transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}
      >
<div className="flex items-center justify-between">
  
  {/* LEFT: Department Image + Info */}
  <div className="flex items-center gap-4">
    
    {/* Department Image OR Default Icon */}
    {department.icon ? (
      <img
        src={department.icon}
        alt="Department Icon"
        className="w-16 h-16 object-cover rounded-xl border"
      />
    ) : (
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-xl border text-3xl ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {/* Default Icon */}
        <Building2 size={32} />
      </div>
    )}

    {/* Department Text */}
    <div>
      <h2 className="text-3xl font-bold">{department.name}</h2>
      <p
        className={`mt-1 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {department.description}
      </p>
    </div>
  </div>

  {/* EDIT BUTTON */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700"
    onClick={() => navigate(`/admin/departments/edit/${id}`)}
  >
    <ClipboardList size={18} />
    Edit
  </motion.button>
</div>

        {/* Employees Count */}
        <div className="mt-6 flex items-center gap-4">
          <span
            className={`px-4 py-2 rounded-full font-medium ${
              darkMode
                ? "bg-indigo-900 text-indigo-300"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            Total Employees: {department.employees?.length || 0}
          </span>

          {/* Add Employee */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className={`p-3 rounded-full shadow ${
              darkMode
                ? "bg-green-900 text-green-300 hover:bg-green-800"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            onClick={() => navigate(`/admin/employees/add?dept=${id}`)}
          >
            <UserPlus size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Employee List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border rounded-2xl shadow p-6 transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}
      >
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Building2
            size={24}
            className={darkMode ? "text-indigo-400" : "text-indigo-600"}
          />
          Employees in this Department
        </h3>

        {department.employees?.length === 0 ? (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            No employees found in this department.
          </p>
        ) : (
          <div className="space-y-4">
            {department.employees?.map((emp) => (
              <div
                key={emp._id}
                className={`flex justify-between p-4 rounded-xl items-center transition-all duration-300 ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div>
                  <p className="text-lg font-medium">{emp.name}</p>
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {emp.role}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    className={`p-2 rounded-full shadow ${
                      darkMode
                        ? "bg-red-900 text-red-300 hover:bg-red-800"
                        : "bg-red-200 text-red-700 hover:bg-red-300"
                    }`}
                    onClick={() =>
                      alert(`Remove employee: ${emp.name}`)
                    }
                  >
                    <UserMinus size={18} />
                  </motion.button> */}

                  <button
                    className={`hover:underline ${
                      darkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                    onClick={() =>
                      navigate(`/admin/employees/view/${emp._id}`)
                    }
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DepartmentDetails;
