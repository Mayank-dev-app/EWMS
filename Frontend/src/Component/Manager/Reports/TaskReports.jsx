import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";

const TaskReports = () => {
  const [department, setDepartment] = useState("");
  const [employee, setEmployee] = useState("");
  const [status, setStatus] = useState("");

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportRef = useRef();
  const { darkMode } = useTheme();

  // ================================
  // 🔥 Load Departments (Safe)
  // ================================
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await api.get("/global/departments");

        // SAFE: Always convert to array
        const deptData =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.departments)
              ? res.data.departments
              : [];

        setDepartments(deptData);
      } catch (err) {
        console.log("Dept Error:", err);
        setDepartments([]);
      }
    };

    loadDepartments();
  }, []);

  // ================================
  // 🔥 Load Employees (Safe)
  // ================================
  useEffect(() => {
    const loadEmployees = async () => {
      if (!department) return setEmployees([]);

      try {
        const res = await api.get("/global/employees", {
          params: { department },
        });

        const empData = Array.isArray(res.data) ? res.data : [];
        setEmployees(empData);
      } catch (err) {
        console.log("Employee Fetch Error:", err);
        setEmployees([]);
      }
    };

    loadEmployees();
  }, [department]);

  // ================================
  // 🔥 Fetch Task Reports
  // ================================
  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = {};
      if (department) params.department = department;
      if (employee) params.employee = employee;
      if (status) params.status = status;

      const res = await api.get("/manager/task-reports", { params });

      const reportData = Array.isArray(res.data) ? res.data : [];
      setReports(reportData);
    } catch (error) {
      console.log("Fetch Reports Error:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [department, employee, status]);

  // ================================
  // 📄 Export PDF
  // ================================
  const exportPDF = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head><title>Task Reports</title></head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // ================================
  // 📊 Export Excel (CSV)
  // ================================
  const exportExcel = () => {
    const header = ["Task Title", "Employee", "Department", "Status", "Created"];

    const rows = reports.map((r) => [
      r.title || "",
      r.employee?.name || "",
      r.department?.name || "",
      r.status || "",
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = "task_reports.csv";
    a.click();
  };

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Task Reports
      </motion.h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Department */}
        <select
          className={`p-3 border rounded-xl ${darkMode ? "bg-slate-800 text-white" : "bg-gray-50"
            }`}
          value={department}
          onChange={(e) => {
            setEmployee("");
            setDepartment(e.target.value);
          }}
        >
          <option value="">All Departments</option>

          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Employee */}
        <select
          className={`p-3 border rounded-xl ${darkMode ? "bg-slate-800 text-white" : "bg-gray-50"
            }`}
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          disabled={employees.length === 0}
        >
          <option value="">All Employees</option>

          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>


        {/* Status */}
        <select
          className={`p-3 border rounded-xl ${darkMode ? "bg-slate-800 text-white" : "bg-gray-50"
            }`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={exportExcel}
            className="flex-1 p-3 bg-green-600 text-white rounded-xl flex justify-center gap-2"
          >
            <FileSpreadsheet size={18} /> Excel
          </button>

          <button
            onClick={exportPDF}
            className="flex-1 p-3 bg-red-600 text-white rounded-xl flex justify-center gap-2"
          >
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        ref={reportRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`overflow-x-auto rounded-xl shadow-lg ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
      >
        <table className="w-full text-left">
          <thead className={darkMode ? "bg-slate-700" : "bg-gray-100"}>
            <tr>
              <th className="p-3">Task</th>
              <th className="p-3">Employee</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((r) => (
                <tr key={r._id}>
                  <td className="p-3">{r.title}</td>
                  <td className="p-3">{r.employee?.name}</td>
                  <td className="p-3">{r.department?.name}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No Reports Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default TaskReports;
