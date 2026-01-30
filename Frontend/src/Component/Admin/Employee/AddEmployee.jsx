import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Briefcase,
  CheckCircle,
  XCircle,
  LockIcon,
  PhoneCall,
  Image as ImgIcon,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    department: "",
    status: "Active",
    image: null,
  });

  const [managerExists, setManagerExists] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fieldAnim = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (employee.role === "Manager" && employee.department) {
      checkManager(employee.department);
    }
  }, [employee.role, employee.department]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/admin/departments");
        setDepartments(res.data.departments);
      } catch (err) {
        console.error("Fetch Departments Error:", err);
      }
    };
    fetchDepartments();
  }, []);

  const checkManager = async (deptId) => {
    try {
      const res = await api.get(`/admin/check-manager/${deptId}`);
      setManagerExists(res.data.exists); // true/false
    } catch (err) {
      console.error("Manager Check Error:", err);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };


  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee({ ...employee, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!employee.name) errs.name = "Name is required";
    if (!employee.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(employee.email))
      errs.email = "Invalid email";
    if (!employee.password) errs.password = "Password is required";
    if (!employee.phone) errs.phone = "Phone Number is required";
    if (!employee.role) errs.role = "Role is required";
    if (!employee.department) errs.department = "Department is required";
    if (!employee.image) errs.image = "Employee photo is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (employee.role === "Manager" && managerExists) {
      alert("This department already has a Manager!");
      return;
    }


    try {
      setSubmitting(true);
      const formData = new FormData();

      Object.entries(employee).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await api.post("/admin/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        alert("Employee added successfully!");
        navigate("/admin/employees");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-xl 
${darkMode
          ? "bg-gray-900/80 text-white backdrop-blur-xl border border-white/10"
          : "bg-white text-gray-800 shadow-gray-300"
        }
`}
    >
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Add New Employee
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4 ">

        {/* ---------------- PHOTO UPLOAD ---------------- */}
        <div className="bg-gray-200/20 p-6 rounded-xl border border-gray-300/20">
          <h3 className="font-semibold mb-4 text-lg">Profile Photo</h3>

          <div className="flex items-center gap-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-24 h-24 rounded-full object-cover border shadow-md"
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center
                  ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                >
                  <ImgIcon size={32} className="text-gray-500" />
                </div>
              )}
            </motion.div>

            <motion.input
              type="file"
              accept="image/*"
              onChange={handleImage}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer block"
            />
          </div>

          {errors.image && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <XCircle size={14} /> {errors.image}
            </p>
          )}
        </div>

        {/* ---------------- PERSONAL INFO ---------------- */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div variants={fieldAnim} initial="initial" animate="animate" className="relative">
              <User className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full border p-3 pl-10 rounded-lg ${errors.name ? "border-red-500" : ""
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle size={14} /> {errors.name}
                </p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div variants={fieldAnim} initial="initial" animate="animate" className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full border p-3 pl-10 rounded-lg ${errors.email ? "border-red-500" : ""
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle size={14} /> {errors.email}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={fieldAnim} initial="initial" animate="animate" className="relative">
              <LockIcon className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={employee.password}
                onChange={handleChange}
                placeholder="********"
                className={`w-full border p-3 pl-10 rounded-lg ${errors.password ? "border-red-500" : ""
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle size={14} /> {errors.password}
                </p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div variants={fieldAnim} initial="initial" animate="animate" className="relative">
              <PhoneCall className="absolute top-3 left-3 text-gray-400" />
              <input
                type="number"
                name="phone"
                value={employee.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                className={`w-full border p-3 pl-10 rounded-lg ${errors.phone ? "border-red-500" : ""
                  }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle size={14} /> {errors.phone}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* ---------------- WORK INFO ---------------- */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Work Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Role */}
            <motion.div variants={fieldAnim} initial="initial" animate="animate" className="relative">
              <Briefcase className="absolute top-3 left-3 text-gray-400" />
              <select
                name="role"
                value={employee.role}
                onChange={handleChange}
                className={`w-full border p-3 pl-10 rounded-lg
    ${darkMode ? "bg-[#1f2937] text-white border-gray-600" : "bg-white text-black border-gray-300"}
    ${errors.role ? "border-red-500" : ""}
  `}
              >
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="">
                  Select Role
                </option>
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Sales Executive">
                  Sales Executive
                </option>
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Manager">
                  Manager
                </option>
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Inventory Manager">
                  Inventory Manager
                </option>
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Web Developer">
                  Web Developer
                </option>
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Software Developer">
                  Software Developer
                </option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle size={14} /> {errors.role}
                </p>
              )}
            </motion.div>

            {/* Department */}
            <motion.div variants={fieldAnim} initial="initial" animate="animate" className="relative">
              <Building2 className="absolute top-3 left-3 text-gray-400" />
              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                className={`w-full border p-3 pl-10 rounded-lg 
    ${darkMode ? "bg-[#1f2937] text-white border-gray-600" : "bg-white text-black border-gray-300"}
    ${errors.department ? "border-red-500" : ""}
  `}
              >
                <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="">
                  Select Department
                </option>

                {departments.map((d) => (
                  <option
                    key={d._id}
                    value={d._id}
                    className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"}
                  >
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle size={14} /> {errors.department}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {employee.role === "Manager" && managerExists && (
          <p className="text-red-500 text-sm mt-1">
            This department already has a Manager!
          </p>
        )}


        {/* STATUS */}
        <div className="w-full sm:w-1/3">
          <select
            name="status"
            value={employee.status}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg 
            ${darkMode ? "bg-[#1f2937] text-white border-gray-600" : "bg-white text-black border-gray-300"}
             `}
          >
            <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Active">
              Active
            </option>
            <option className={darkMode ? "bg-[#111827] text-white" : "bg-white text-black"} value="Inactive">
              Inactive
            </option>
          </select>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md"
          >
            <CheckCircle className="inline mr-2" />
            {submitting ? "Adding..." : "Add Employee"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => navigate(-1)}
            className={`flex-1 px-6 py-3 rounded-lg border 
              ${darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-100 border-gray-300"}`}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddEmployee;
