import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Hooks/DarkLight";
import {
  Clock,
  User,
  Tag,
  FileText,
  MessageSquare,
  Trash2,
  Send,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

const TaskDetailsPage = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // 👉 FETCH TASK BY ID
  const fetchTaskDetails = async () => {
    try {
      const res = await api.get(`/manager/tasks/${id}`);

      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  // 👉 ADD COMMENT
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/employee/${id}/comment`, {
        text: newComment,
      });

      if (res.data.success) {
        setTask((prev) => ({
          ...prev,
          comments: [...prev.comments, res.data.comment],
        }));
        setNewComment("");
      }
    } catch (err) {
      console.error("Add comment error:", err.response?.data || err);
    }
  };

  // 👉 DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/manager/tasks/${id}/comment/${commentId}`);

      setTask((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Delete comment error:", err.response?.data || err);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-xl">
        Loading task details...
      </div>
    );

  if (!task)
    return (
      <div className="p-6 text-center text-xl text-red-500">
        Task not found.
      </div>
    );

  return (
    <motion.div
      className={`min-h-screen p-6 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100"
        }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">{task.title} { task.task }</h1>

      <div
        className={`p-6 rounded-3xl shadow-lg border ${darkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
          }`}
      >
        {/* DESCRIPTION */}
        <p className="text-lg opacity-90 mb-6 flex items-start gap-3">
          <FileText size={20} />
          {task.description}
        </p>

        {/* TASK META */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <p className="flex items-center gap-2">
            <User size={18} /> Assigned To:{" "}
            <b>{task.employee?.name || "N/A"}</b>
          </p>

          <p className="flex items-center gap-2">
            <Tag size={18} /> Priority:
            <span
              className={`px-2 py-1 rounded-lg text-sm ${task.priority === "High"
                ? "bg-red-500/20 text-red-500"
                : "bg-green-500/20 text-green-500"
                }`}
            >
              {task.priority}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <Clock size={18} /> Assigned On: <b>{task.assignedOn}</b>
          </p>

          <p className="flex items-center gap-2">
            <Clock size={18} /> Deadline: <b>{task.deadline}</b>
          </p>
        </div>

        {/* STATUS */}
        <p
          className={`mb-6 font-semibold text-lg ${task.status === "In Progress"
            ? "text-blue-500"
            : task.status === "Pending"
              ? "text-yellow-500"
              : "text-green-500"
            }`}
        >
          Status: {task.status}
        </p>

        {/* COMMENTS */}
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <MessageSquare size={20} /> Comments
        </h2>

        {/* SHOW COMMENTS */}
        <div className="space-y-3 mb-4">
          {task.comments?.map((c, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl ${darkMode ? "bg-slate-700" : "bg-gray-100"
                }`}
            >

              <p className="font-semibold">{c.author}</p>
              <p className="opacity-80 text-sm">{c.text}</p>

            </div>
          ))}

          {(!task.comments || task.comments.length === 0) && (
            <p className="opacity-60">No comments yet.</p>
          )}
        </div>

        {/* ADD COMMENT INPUT */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-3 rounded-xl outline-none ${darkMode ? "bg-slate-700" : "bg-gray-200"
              }`}
            placeholder="Add a comment..."
          />

          <button
            onClick={handleAddComment}
            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetailsPage;
