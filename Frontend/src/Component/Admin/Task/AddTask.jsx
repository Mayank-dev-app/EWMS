import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Hooks/DarkLight";

const AddTask = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    employee: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    console.log("Task Created (Dummy): ", task);
    alert("Task created (Dummy Data Added)");
    navigate("/admin/tasks");
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 shadow rounded-lg transition-all 
      ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"}
    `}
    >
      <h2 className="text-3xl font-semibold mb-6">Add New Task</h2>

      <div className="space-y-4">

        {/* TITLE */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1 
              ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
            `}
            placeholder="Enter task title"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className={`w-full border p-2 rounded h-28 mt-1 
              ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
            `}
            placeholder="Task details..."
          ></textarea>
        </div>

        {/* PRIORITY */}
        <div>
          <label className="font-semibold">Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1
              ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
            `}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="font-semibold">Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1
              ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
            `}
          >
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* EMPLOYEE */}
        <div>
          <label className="font-semibold">Assigned Employee</label>
          <input
            type="text"
            name="employee"
            value={task.employee}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1
              ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
            `}
            placeholder="Enter employee name"
          />
        </div>

        {/* DUE DATE */}
        <div>
          <label className="font-semibold">Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1
              ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white"}
            `}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Task
        </button>

        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded text-white 
            ${darkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-400 hover:bg-gray-500"}
          `}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTask;
