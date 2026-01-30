import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../Hooks/DarkLight";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // ✅ THEME HOOK

  // DUMMY DATA
  const dummyTask = {
    id,
    title: "Website UI Update",
    description: "Update homepage UI and fix responsive issues",
    priority: "High",
    status: "Pending",
    employee: "Rahul Sharma",
    dueDate: "2025-11-20T15:30",
    createdAt: "2025-11-10T09:15",
  };

  const [task, setTask] = useState(dummyTask);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // SAVE BUTTON
  const handleSave = () => {
    console.log("Updated Task:", task);
    alert("Dummy Task Saved! (Backend not connected)");
    navigate(`/admin/tasks/${id}`);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-2xl mx-auto p-6 shadow rounded-lg transition ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-3xl font-semibold mb-6">Edit Task</h2>

        <div className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className={`w-full border p-2 rounded transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className={`w-full border p-2 rounded h-28 transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            ></textarea>
          </div>

          {/* PRIORITY */}
          <div>
            <label className="font-semibold">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className={`w-full border p-2 rounded transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
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
              className={`w-full border p-2 rounded transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
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
              className={`w-full border p-2 rounded transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* DUE DATE */}
          <div>
            <label className="font-semibold">Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={task.dueDate.slice(0, 16)}
              onChange={handleChange}
              className={`w-full border p-2 rounded transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* CREATED AT */}
          <div>
            <label className="font-semibold">Created At</label>
            <input
              type="text"
              value={new Date(task.createdAt).toLocaleString()}
              readOnly
              className={`w-full border p-2 rounded transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-400"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
