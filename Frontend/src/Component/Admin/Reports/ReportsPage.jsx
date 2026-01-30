import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileBarChart,
  FileDown,
  CalendarRange,
  ListChecks,
  Users,
  Building2,
} from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";

const reportTypes = [
  {
    id: "task",
    title: "Task Report",
    icon: <ListChecks className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
    description: "Get daily, weekly or monthly task performance overview.",
  },
  {
    id: "employee",
    title: "Employee Report",
    icon: <Users className="w-8 h-8 text-green-600 dark:text-green-400" />,
    description: "Track employee performance and daily activity.",
  },
  {
    id: "department",
    title: "Department Report",
    icon: <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    description: "Monitor department-wise productivity.",
  },
];

const ReportsPage = () => {
  const { darkMode } = useTheme();

  const [selectedType, setSelectedType] = useState("");
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState("");

  return (
    <div
      className={`p-6 max-w-7xl mx-auto transition-all ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6"
      >
        Reports & Analytics
      </motion.h1>

      {/* REPORT TYPE GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reportTypes.map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedType(report.id)}
            className={`cursor-pointer p-5 rounded-2xl shadow border transition
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:border-blue-400"
                  : "bg-white border-gray-200 hover:border-blue-500"
              }
              ${
                selectedType === report.id
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-300"
              }
            `}
          >
            <div>{report.icon}</div>
            <h2 className="text-lg font-semibold mt-4">{report.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              {report.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* FILTER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mt-10 p-6 rounded-2xl shadow border transition ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-blue-500" />
          Filter Reports
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="font-medium">Report Type</label>
            <select
              className={`w-full p-2 mt-1 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white"
              }`}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="task">Task Report</option>
              <option value="employee">Employee</option>
              <option value="department">Department</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="font-medium">Duration</label>
            <select
              className={`w-full p-2 mt-1 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white"
              }`}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">Select</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Date</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="font-medium">Format</label>
            <select
              className={`w-full p-2 mt-1 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white"
              }`}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="">Select</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => alert("Report Generate Logic Add Later")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg flex gap-2 items-center"
        >
          <FileDown className="w-5 h-5" />
          Generate Report
        </motion.button>
      </motion.div>

      {/* REPORT PREVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`mt-10 p-6 rounded-2xl shadow border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-green-500" />
          Report Preview (Static)
        </h3>

        <p className="text-gray-500 dark:text-gray-300 text-sm">
          Once API connected, a preview of the generated report will appear
          here.
        </p>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
