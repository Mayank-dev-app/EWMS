import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import { User, Calendar, Clipboard, Trash2, Edit } from "lucide-react";
import api from "../../api/api";

const AssignTask = () => {
  const { darkMode } = useTheme();

  const [task, setTask] = useState("");
  const [employee, setEmployee] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");

  const [tasksList, setTasksList] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  // Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/manager/get-department");
        setDepartmentList(res.data.departments || []);
      } catch (error) {
        console.log(error);
        setErrorMsg("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch Employees
  useEffect(() => {
    if (!department) return;

    const fetchEmployees = async () => {
      try {
        const res = await api.get(`/manager/by-department/${department}`);
        setEmployeeList(res.data.employees || []);
      } catch (error) {
        console.log(error);
        setErrorMsg("Failed to load employees");
      }
    };

    fetchEmployees();
  }, [department]);

  // Auto-hide messages
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Assign or Update Task
  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!task || !deadline || !employee || !department) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    const payload = {
      title: task,
      employee,
      department,
      dueDate: deadline,
      priority,
      description,
    };

    try {
      if (editingTaskId) {
        // UPDATE
        const res = await api.put(`/manager/task/${editingTaskId}`, payload);
        setTasksList((prev) =>
          prev.map((t) => (t._id === editingTaskId ? res.data.task : t))
        );
        setSuccessMsg("Task successfully updated!");
        setEditingTaskId(null);
      } else {
        // CREATE
        const res = await api.post("/manager/assign-task", payload);
        setTasksList([...tasksList, res.data.task]);
        setSuccessMsg("Task successfully assigned!");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to save task. Try again!");
    }

    setTask("");
    setEmployee("");
    setDeadline("");
    setPriority("Medium");
    setDepartment("");
    setDescription("");
  };

  // Edit Task
  const handleEditTask = (index) => {
    const t = tasksList[index];

    setTask(t.title);
    setEmployee(t.employee?._id);
    setDepartment(t.department?._id);
    setDeadline(t.dueDate?.split("T")[0]);
    setPriority(t.priority);
    setDescription(t.description);
    setEditingTaskId(t._id);
  };

  // Delete Task
  const handleDeleteTask = async (index) => {
    const taskId = tasksList[index]._id;

    try {
      await api.delete(`/manager/task/${taskId}`);
      setTasksList(tasksList.filter((t) => t._id !== taskId));
      setSuccessMsg("Task deleted successfully!");
      if (editingTaskId === taskId) setEditingTaskId(null);
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to delete task!");
    }
  };

  const cardHover = {
    scale: 1.03,
    rotateX: -5,
    rotateY: 5,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  };

  return (
    <motion.div
      className={`min-h-screen p-6 ${darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-black"
        }`}
    >
      <h1 className="text-3xl font-bold mb-6">Assign New Task</h1>

      {/* Messages */}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg text-green-700 bg-green-200 border border-green-400">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg text-red-700 bg-red-200 border border-red-400">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <motion.form
        className={`p-6 rounded-3xl shadow-xl max-w-4xl mx-auto mb-10 ${darkMode ? "bg-slate-800" : "bg-white"
          }`}
        onSubmit={handleAssignTask}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Task Name */}
          <div>
            <label className="font-semibold">Task Name</label>
            <input
              type="text"
              className={`p-2 rounded-lg border w-full ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-black"}`}
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>

          {/* Department */}
          <div>
            <label className="font-semibold">Department</label>
            <select
              className={`p-2 rounded-lg border w-full transition-all duration-200
               ${darkMode
                  ? "bg-slate-800 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                  : "bg-white text-slate-900 border-slate-300 focus:border-blue-600 focus:ring-blue-300"
                }`}
              value={department || ""}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select</option>
              {departmentList.map((d) => (
                <option key={d?._id} value={d?._id}>{d?.name || "Unnamed"}</option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div>
            <label className="font-semibold">Employee</label>
            <select
              className={`p-2 rounded-lg border w-full transition-all duration-200
               ${darkMode
                  ? "bg-slate-800 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                  : "bg-white text-slate-900 border-slate-300 focus:border-blue-600 focus:ring-blue-300"
                }`}
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              <option value="">Select</option>
              {employeeList.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="font-semibold">Deadline</label>
            <input
              type="date"
              className={`p-2 rounded-lg border w-full ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-black"}`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="font-semibold">Priority</label>
            <select
              className={`p-2 rounded-lg border w-full transition-all duration-200
               ${darkMode
                  ? "bg-slate-800 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                  : "bg-white text-slate-900 border-slate-300 focus:border-blue-600 focus:ring-blue-300"
                }`}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="font-semibold">Description</label>
            <textarea
              className={`p-2 rounded-lg border w-full h-28 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-black"}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl">
          {editingTaskId ? "Update Task" : "Assign Task"}
        </button>
      </motion.form>

      {/* Task List */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasksList.map((t, idx) => (
          <motion.div key={idx} className={`p-4 rounded-2xl shadow-lg ${darkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`} whileHover={cardHover}>
            <h3 className="font-bold text-lg">{t.title}</h3>
            <p>Employee: {t.employee?.name}</p>
            <p>Department: {t.department?.name}</p>
            <p>Deadline: {t.dueDate?.split("T")[0]}</p>
            <p>Priority: {t.priority}</p>
            <p>{t.description}</p>

            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => handleEditTask(idx)}>
                <Edit className="text-blue-500" />
              </button>
              <button onClick={() => handleDeleteTask(idx)}>
                <Trash2 className="text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AssignTask;
