import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api"; // Axios instance

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // 🔥 New state

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/admin/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setEmployee(res.data.employee);
        } else {
          alert("Employee not found");
          navigate("/admin/employees");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  if (loading) {
    return (
      <p className={`text-center mt-20 ${theme === "dark" ? "text-white" : "text-black"}`}>
        Loading Employee Data...
      </p>
    );
  }

  const handleChange = (e) => setEmployee({ ...employee, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!employee.name) errs.name = "Name is required";
    if (!employee.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(employee.email)) errs.email = "Invalid email";
    if (!employee.role) errs.role = "Role is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      try {
        setSubmitting(true); // 🔥 Disable button
        const token = localStorage.getItem("token");

        const res = await api.put(`/admin/employee/edit/${id}`, employee, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          alert("Employee updated successfully!");
          navigate("/admin/employees");
        } else {
          alert("Failed to update employee");
        }
      } catch (error) {
        console.error("Update Employee Error:", error);
        alert("Something went wrong while updating employee");
      } finally {
        setSubmitting(false); // 🔥 Re-enable button after API response
      }
    }
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 rounded-2xl shadow-xl transition-all duration-300
      ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
    >
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Edit Employee
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div className="relative">
          <User className={`absolute top-3 left-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={`w-full p-3 pl-10 rounded-lg border outline-none transition
              placeholder-gray-400
              ${theme === "dark"
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-gray-800 border-gray-300"}
              ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {errors.name}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="relative">
          <Mail className={`absolute top-3 left-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            placeholder="Email Address"
            className={`w-full p-3 pl-10 rounded-lg border outline-none transition
              placeholder-gray-400
              ${theme === "dark"
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-gray-800 border-gray-300"}
              ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {errors.email}
            </p>
          )}
        </div>

        {/* ROLE */}
        <div className="relative">
          <Briefcase className={`absolute top-3 left-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          <select
            name="role"
            value={employee.role}
            onChange={handleChange}
            className={`w-full p-3 pl-10 rounded-lg border outline-none transition
              ${theme === "dark"
                ? "bg-gray-800 text-gray-200 border-gray-600"
                : "bg-white text-gray-800 border-gray-300"}
              ${errors.role ? "border-red-500" : ""}`}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Sales Executive">Sales Executive</option>
            <option value="Inventory Manager">Inventory Manager</option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {errors.role}
            </p>
          )}
        </div>

        {/* STATUS */}
        <select
          name="status"
          value={employee.status}
          onChange={handleChange}
          className={`w-full p-3 rounded-lg border outline-none transition
            ${theme === "dark"
              ? "bg-gray-800 text-gray-200 border-gray-600"
              : "bg-white text-gray-800 border-gray-300"}`}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting} // 🔥 Disabled while submitting
            className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg shadow transition flex items-center justify-center gap-2
              ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
          >
            <CheckCircle size={18} /> {submitting ? "Updating..." : "Update Employee"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate(-1)}
            className={`flex-1 px-6 py-3 rounded-lg shadow transition
              ${theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
