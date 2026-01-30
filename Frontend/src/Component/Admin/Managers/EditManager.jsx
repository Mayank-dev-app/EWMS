import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCog, Mail, Phone, Building, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../Hooks/DarkLight";

const EditManager = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();

  // Sample Data
  const allManagers = [
    {
      id: 1,
      name: "Rohit Sharma",
      email: "rohit@example.com",
      phone: "+91 9876543210",
      department: "Sales",
    },
    {
      id: 2,
      name: "Anjali Gupta",
      email: "anjali@example.com",
      phone: "+91 9898989898",
      department: "Marketing",
    },
    {
      id: 3,
      name: "Vikram Singh",
      email: "vikram@example.com",
      phone: "+91 9001234500",
      department: "HR",
    },
  ];

  const [manager, setManager] = useState(null);

  useEffect(() => {
    const foundManager = allManagers.find((m) => m.id === Number(id));
    setManager(foundManager);
  }, [id]);

  if (!manager) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300 text-lg">
        Loading manager data...
      </div>
    );
  }

  const handleChange = (e) => {
    setManager({ ...manager, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Manager updated successfully!");
    navigate("/admin/managers");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 dark:text-white"
      >
        Edit Manager
      </motion.h1>

      {/* FORM CARD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 border dark:border-gray-700"
      >
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
              Manager Name
            </label>
            <div className="flex items-center gap-3 border rounded-xl p-3 dark:border-gray-600 dark:bg-gray-800">
              <UserCog className="text-blue-600" />
              <input
                type="text"
                name="name"
                value={manager.name}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
              Email
            </label>
            <div className="flex items-center gap-3 border rounded-xl p-3 dark:border-gray-600 dark:bg-gray-800">
              <Mail className="text-red-500" />
              <input
                type="email"
                name="email"
                value={manager.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
              Phone
            </label>
            <div className="flex items-center gap-3 border rounded-xl p-3 dark:border-gray-600 dark:bg-gray-800">
              <Phone className="text-green-600" />
              <input
                type="text"
                name="phone"
                value={manager.phone}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
              Department
            </label>
            <div className="flex items-center gap-3 border rounded-xl p-3 dark:border-gray-600 dark:bg-gray-800">
              <Building className="text-purple-600" />
              <select
                name="department"
                value={manager.department}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-800 dark:text-gray-200"
              >
                <option>Sales</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </div>
          </div>

          {/* UPDATE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Save size={20} />
            Update Manager
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditManager;
