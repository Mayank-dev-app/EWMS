// ⚠️ COMPLETE FIXED COMPONENT
// React bracket structure 100% corrected

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Upload,
  FileText,
  Calendar,
  Activity,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "../Hooks/DarkLight";
import api from "../api/api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { darkMode, toggleTheme } = useTheme();

  const summaryMiniCard = `
  flex flex-col items-center justify-center
  px-2 py-1.5
  rounded-lg
  text-xs font-medium
  border
  ${darkMode
      ? "bg-gray-900 border-gray-700 text-gray-300"
      : "bg-gray-100 border-gray-300 text-gray-700"}
`;

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const selectedTask = useMemo(
    () => tasks.find((t) => t._id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  const isApproved = selectedTask?.approval?.status === "Approved";

  const fetchTasks = async () => {
    try {
      const res = await api.get("/employee/my-tasks");
      setTasks(res.data.tasks);

      if (res.data.tasks.length && !selectedTaskId) {
        setSelectedTaskId(res.data.tasks[0]._id);
      }
    } catch (err) {
      console.error("Fetch Task Error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addComment = async (taskId, comment) => {
    if (!comment.trim()) return;

    try {
      await api.post(`/employee/${taskId}/comment`, { text: comment });
      await fetchTasks();
      setNewComment("");
    } catch (err) {
      console.error("Comment Error:", err);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/employee/${taskId}/status`, { status });
      await fetchTasks();
    } catch (err) {
      console.error("Status Error:", err);
    }
  };

  const uploadFiles = async (taskId, files) => {
    if (!files.length) return;

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      await api.post(`/employee/${taskId}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchTasks();
      setSelectedFiles([]);
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const summary = useMemo(() => {
    const today = new Date();

    const tasksAssignedToday = tasks.filter((t) => {
      const d = new Date(t.createdAt);
      return d.toDateString() === today.toDateString();
    }).length;

    const tasksAssignedWeek = tasks.filter((t) => {
      const d = new Date(t.createdAt);
      return (today - d) / (1000 * 60 * 60 * 24) <= 7;
    }).length;

    return {
      tasksAssignedToday,
      tasksAssignedWeek,
      totalTasks: tasks.length,
      totalCompleted: tasks.filter((t) => t.status === "Completed").length,
    };
  }, [tasks]);

  return (
    <div
      className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`
    shadow-xl 
    p-4 
    rounded-2xl  
    h-[calc(100vh-100px)] 
    overflow-y-auto 
    sticky top-4

    ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
  `}
          style={{ width: "320px", minWidth: "320px" }}   // 🔥 FIXED SIZE
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User size={18} /> My Tasks
          </h3>

          {/* TASK LIST */}
          <div className="relative">
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 hide-scrollbar">
              {tasks.map((task) => (
                <button
                  key={task._id}
                  onClick={() => setSelectedTaskId(task._id)}
                  className={`
                    w-full text-left p-4 
                    rounded-xl 
                    border 
                    transition-all 
                    duration-300

        ${selectedTaskId === task._id
                      ? "ring-2 ring-indigo-500 border-indigo-500 shadow-md"
                      : "border-gray-300 dark:border-gray-700"
                    }

        ${darkMode
                      ? "bg-gray-900 hover:bg-gray-700"
                      : "bg-gray-50 hover:bg-gray-100"
                    }
      `}
                >
                  <div className="font-semibold">{task.title}</div>

                  <div className="text-sm opacity-70 mt-1">
                    {task.description.slice(0, 80)}...
                  </div>

                  {task.approval?.status && task.approval.status !== "Pending" && (
                    <div
                      className={`
            mt-4 p-3 rounded-xl border text-sm
            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"}
          `}
                    >
                      <p>
                        <b>Status:</b>{" "}
                        <span
                          className={
                            task.approval.status === "Approved"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {task.approval.status}
                        </span>
                      </p>

                      <p className="mt-1">
                        <b>Manager:</b> {task.approval.manager?.name}
                      </p>

                      <p className="italic opacity-80 mt-1">
                        “{task.approval.managerComment}”
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 text-xs mt-3 opacity-60 items-center">
                    <Calendar size={14} />
                    {task.deadline}

                    <Clock size={14} />
                    {task.status}
                  </div>
                </button>
              ))}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-black/10 to-transparent" />
            </div>
          </div>

          {/* SUMMARY SECTION */}
          <div className="mt-4 border-t pt-3 border-gray-300 dark:border-gray-700">
            <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold opacity-80">
              <Activity size={14} /> Summary
            </h4>

            <div className="grid grid-cols-4 gap-2">
              <div className={summaryMiniCard}>
                Today
                <span>{summary.tasksAssignedToday}</span>
              </div>

              <div className={summaryMiniCard}>
                Week
                <span>{summary.tasksAssignedWeek}</span>
              </div>

              <div className={summaryMiniCard}>
                Total
                <span>{summary.totalTasks}</span>
              </div>

              <div className={summaryMiniCard}>
                Done
                <span className="text-green-500">
                  {summary.totalCompleted}
                </span>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Right Side */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl shadow-xl p-8 w-[700px] 
    ${darkMode ? "bg-gray-900 text-white" : "bg-white"} 
  `}
          style={{ minHeight: "85vh" }}
        >

          {!selectedTask ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              Select a task to view details
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold">{selectedTask.title}</h2>
                  <p className="text-sm opacity-70 mt-1">Assigned by Manager</p>
                </div>

                <span
                  className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${selectedTask.priority === "High"
                      ? "bg-red-500/20 text-red-500"
                      : selectedTask.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-green-500/20 text-green-600"
                    }
          `}
                >
                  {selectedTask.priority}
                </span>
              </div>

              {/* Description */}
              <p className="opacity-90 text-lg leading-relaxed">
                {selectedTask.description}
              </p>

              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">

                {/* Status Buttons */}
                <div className="flex gap-3 flex-wrap">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      disabled={isApproved}
                      onClick={() => {
                        console.log("Clicked status:", s);
                        updateStatus(selectedTask._id, s);
                      }}
                      className={`
      px-4 py-2 rounded-full text-sm font-medium transition-all
      ${selectedTask.status === s
                          ? "bg-indigo-600 text-white shadow"
                          : darkMode
                            ? "bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                        }
      ${isApproved ? "opacity-50 cursor-not-allowed" : ""}
    `}
                    >
                      {s}
                    </button>
                  ))}

                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`
      px-4 py-2 rounded-xl shadow 
      flex items-center gap-2 border transition
      ${darkMode
                      ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    }
    `}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-10">
                <div className="flex justify-between mb-2 items-center">
                  <h3 className="text-lg font-semibold">Remarks / Comments</h3>

                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="text-indigo-500 text-sm underline"
                  >
                    {showAllComments ? "Hide all comments" : "View all comments"}
                  </button>
                </div>

                <div className="space-y-3 mt-3">
                  {(showAllComments
                    ? selectedTask.comments
                    : selectedTask.comments?.slice(-1)
                  )?.map((c) => (
                    <div
                      key={c._id}
                      className={`
                p-4 rounded-xl shadow-sm
                ${darkMode ? "bg-gray-800" : "bg-gray-100"}
              `}
                    >
                      <div className="flex justify-between mb-1">
                        <div>
                          <p className="font-semibold">{c.by?.name}</p>
                          <p className="text-xs opacity-70">{c.by?.role}</p>
                        </div>

                        <span className="text-xs opacity-60">
                          {new Date(c.at).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm opacity-90">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2 mt-4">
                  <input
                    disabled={isApproved}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className={`
                      flex-1 px-3 py-2 rounded-lg border text-sm
                      ${darkMode ? "bg-gray-800 border-gray-600 text-white" : ""}
                      ${isApproved ? "opacity-50 cursor-not-allowed" : ""}
                     `}
                    placeholder={
                      isApproved ? "Task approved — comments locked" : "Write a comment..."
                    }
                  />

                  <button
                    disabled={isApproved}
                    onClick={() => addComment(selectedTask._id, newComment)}
                    className={`
                    px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow
                       ${isApproved ? "opacity-50 cursor-not-allowed" : ""}
                   `}
                  >
                    Add
                  </button>

                </div>
              </div>

              {/* File Upload */}
              <div className="mt-10">
                <h3 className="font-semibold text-lg">Upload Work Files</h3>

                <label
                  className={`
                         mt-3 flex items-center gap-2 px-4 py-3 rounded-lg border
                         ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"}
                        ${isApproved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
                >
                  <Upload size={18} />
                  {isApproved ? "Task Approved — Upload Locked" : "Select Files"}

                  <input
                    type="file"
                    multiple
                    disabled={isApproved}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>


                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    {selectedFiles.map((file, i) => (
                      <div
                        key={i}
                        className={`
                  p-2 rounded text-sm mb-1
                  ${darkMode ? "bg-gray-700" : "bg-gray-200"}
                `}
                      >
                        📄 {file.name}
                      </div>
                    ))}

                    <button
                      onClick={() => uploadFiles(selectedTask._id, selectedFiles)}
                      className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg shadow"
                    >
                      Upload Files
                    </button>
                  </div>
                )}

                {/* Uploaded Files */}
                <div className="mt-6">
                  <h4 className="font-semibold text-md mb-2">Uploaded Files</h4>

                  {selectedTask.uploads?.map((u) => (
                    <div
                      key={u._id}
                      className={`
                p-3 rounded flex justify-between items-center text-sm
                ${darkMode ? "bg-gray-800" : "bg-gray-100"}
              `}
                    >
                      <span className="flex gap-2 items-center">
                        <FileText size={16} /> {u.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}
