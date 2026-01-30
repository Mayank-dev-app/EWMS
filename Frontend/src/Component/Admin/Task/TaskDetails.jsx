import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { darkMode } = useTheme(); // ✅ THEME HOOK
  const [task, setTask] = useState(null);

  // Dummy task list (replace API later)
  useEffect(() => {
    const allTasks = [
      { id: 1, title: "Website Update", description: "Update landing page UI", completed: false, priority: "High", employee: "Rohit", createdAt: "2025-11-12", dueDate: "2025-11-20" },
      { id: 2, title: "API Testing", description: "Test all endpoints", completed: true, priority: "Low", employee: "Anjali", createdAt: "2025-11-10", dueDate: "2025-11-18" },
      { id: 3, title: "Bug Fixing", description: "Fix login errors & routing bugs", completed: false, priority: "Medium", employee: "Ravi", createdAt: "2025-11-11", dueDate: "2025-11-22" }
    ];

    const found = allTasks.find((t) => t.id === Number(id));
    setTask(found);
  }, [id]);

  if (!task) {
    return (
      <div className="p-6 text-center text-gray-500">Task not found...</div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Delete
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      alert("Task Deleted! (API call yaha jayega)");
      navigate("/task/all");
    }
  };

  return (
    <motion.div
      className={`p-6 min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div className="max-w-3xl mx-auto flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-full transition ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <ArrowLeft />
        </button>

        <h1 className="text-3xl font-bold">Task Details</h1>
      </div>

      {/* CARD */}
      <div
        className={`max-w-3xl mx-auto shadow-lg rounded-xl p-6 border transition ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        {/* TITLE + ACTIONS */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold">{task.title}</h2>

          <div className="flex gap-3">
            {/* EDIT */}
            <button
              onClick={() => navigate(`/admin/tasks/edit/${task.id}`)} // ✅ FIXED
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              <Edit size={18} /> Edit
            </button>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 leading-relaxed text-lg">
          {task.description}
        </p>

        <div className="border-t my-5"></div>

        {/* GRID DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* STATUS */}
          <div>
            <strong>Status:</strong>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm text-white ${
                task.completed ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>

          {/* PRIORITY */}
          <div>
            <strong>Priority:</strong>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm text-white ${
                task.priority === "High"
                  ? "bg-red-600"
                  : task.priority === "Medium"
                  ? "bg-yellow-600"
                  : "bg-blue-600"
              }`}
            >
              {task.priority}
            </span>
          </div>

          {/* EMPLOYEE */}
          <div>
            <strong>Assigned To:</strong> <span className="ml-2">{task.employee}</span>
          </div>

          {/* CREATED AT */}
          <div>
            <strong>Created At:</strong>{" "}
            <span className="ml-2">{formatDate(task.createdAt)}</span>
          </div>

          {/* DUE DATE */}
          {task.dueDate && (
            <div>
              <strong>Due Date:</strong>{" "}
              <span className="ml-2">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetails;
