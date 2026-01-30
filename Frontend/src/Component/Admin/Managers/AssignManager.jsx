import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCog, Building2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Hooks/DarkLight";

const AssignManager = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [managerName, setManagerName] = useState("");
  const [department, setDepartment] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAssign = (e) => {
    e.preventDefault();

    if (!managerName || !department) return;

    setSuccess(true);

    setTimeout(() => {
      navigate("/admin/managers");
    }, 1200);
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 dark:text-white"
      >
        Assign Manager to Department
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 max-w-xl border dark:border-gray-700"
      >
        <form onSubmit={handleAssign} className="space-y-5">
          {/* Manager Name */}
          <div>
            <label className="font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <UserCog size={20} className="text-indigo-600" />
              Manager Name
            </label>
            <input
              type="text"
              className="w-full mt-2 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter manager name"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
            />
          </div>

          {/* Department */}
          <div>
            <label className="font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Building2 size={20} className="text-purple-600" />
              Select Department
            </label>

            <select
              className="w-full mt-2 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Choose Department</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="IT">IT</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-indigo-700 transition-all dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Assign Manager
          </motion.button>
        </form>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3 mt-5 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 p-4 rounded-xl"
          >
            <CheckCircle2 size={24} />
            Manager assigned successfully!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AssignManager;
