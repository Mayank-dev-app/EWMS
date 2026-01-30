import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Briefcase, CheckCircle, XCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); 

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/admin/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setEmployee(res.data.employee);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <p className={`text-center mt-20 ${theme === "dark" ? "text-white" : "text-black"}`}>
        Loading Employee Data...
      </p>
    );
  }

  if (!employee) {
    return (
      <p className={`text-center mt-20 ${theme === "dark" ? "text-white" : "text-black"}`}>
        Employee not found.
      </p>
    );
  }

  return (
    <>
      {/* MAIN CARD */}
      <motion.div
        className={`max-w-xl mx-auto p-6 rounded-2xl shadow-xl mt-6 transition-all duration-300
        ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Employee Details
        </h2>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <img
            src={employee.image || "https://i.pravatar.cc/200?img=1"}
            alt={employee.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-md cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIsModalOpen(true)} // open modal on click
          />
        </div>

        {/* Name */}
        <div className="flex items-center gap-3 mb-4">
          <User className="text-indigo-500" />
          <span className="font-semibold">Name:</span>
          <span className="opacity-80">{employee.name}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 mb-4">
          <Mail className="text-indigo-500" />
          <span className="font-semibold">Email:</span>
          <span className="opacity-80">{employee.email}</span>
        </div>

        {/* Role */}
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="text-indigo-500" />
          <span className="font-semibold">Role:</span>
          <span className="opacity-80">{employee.role}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 mb-4">
          {employee.status === "Active" ? (
            <>
              <CheckCircle className="text-green-400" />
              <span className="font-semibold">Status:</span>
              <span className="text-green-400 font-medium">{employee.status}</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-400" />
              <span className="font-semibold">Status:</span>
              <span className="text-red-400 font-medium">{employee.status}</span>
            </>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`mt-6 px-6 py-2 rounded-lg shadow transition w-full
            ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
        >
          Back
        </button>
      </motion.div>

      {/* IMAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="relative">
            <img
              src={employee.image}
              alt={employee.name}
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetails;
