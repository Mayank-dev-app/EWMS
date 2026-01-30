import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Search, X, FileText } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";

const statusColor = {
  Pending: "text-yellow-500",
  Completed: "text-green-500",
  Rejected: "text-red-500",
};

const UniversalApprovalPanel = () => {
  const { darkMode } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [actionTask, setActionTask] = useState(null);
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState("");
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [activeStatus, setActiveStatus] = useState("Pending");


  useEffect(() => {
    loadTasks();
  }, []);

  const openActionModal = (task, type) => {
    setActionTask(task);
    setActionType(type);
    setComment(""); // reset comment
  };


  const loadTasks = async () => {
    try {
      const res = await api.get("/manager/task/approval-list");
      console.log("Approval API response:", res.data); // 🔥 ADD THIS
      setTasks(res.data.tasks); // 👈 DIRECT SET
    } catch (err) {
      console.error("Approval fetch error:", err);
    }
  };

  const handleDecision = async () => {
    if (!comment.trim()) return;

    try {
      await api.put(`/manager/task/approve/${actionTask._id}`, {
        status: actionType,
        remark: comment,
      });

      setTasks(prev =>
        prev.map(t =>
          t._id === actionTask._id
            ? {
              ...t,
              approval: {
                ...t.approval,
                status: actionType, // Approved / Rejected
                managerComment: comment,
              },
            }
            : t
        )
      );

      setActionTask(null);
      setComment("");
      setActionType("");
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  // const filteredTasks = tasks
  //   // 🚫 Approved tasks completely hidden
  //   .filter(t => t.approval?.status !== "Approved")
  //   // Status tab filter
  //   .filter(t => t.approval?.status === activeStatus)
  //   // Search filter
  //   .filter(t =>
  //     `${t.employee?.name} ${t.department?.name}`
  //       .toLowerCase()
  //       .includes(search.toLowerCase())
  //   );


const filteredTasks = tasks
  .filter(t => {
    // Approved tab => show only approved
    if (activeStatus === "Approved") {
      return t.approval?.status === "Approved";
    }

    // Pending / Rejected tabs => hide approved
    return t.approval?.status === activeStatus;
  })
  .filter(t =>
    `${t.employee?.name} ${t.department?.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className={`p-6 min-h-screen flex gap-6 ${darkMode ? "bg-slate-900 text-white" : "bg-slate-100"
        }`}
    >
      {/* LEFT LIST */}
      <div className="w-full lg:w-[70%]">
        <h1 className="text-3xl font-bold mb-6">Task Approvals</h1>

        {/* Search */}
        <div className="flex items-center border rounded-xl p-2 mb-4">
          <Search size={18} className="mr-2 opacity-60" />
          <input
            placeholder="Search employee / department"
            className="bg-transparent w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 mb-4">
          {["Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
        ${activeStatus === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 dark:bg-slate-700"}
      `}
            >
              {s}
            </button>
          ))}
        </div>


        {/* Cards */}
        {filteredTasks.length === 0 ? (
          <p className="text-center opacity-60 mt-10">No pending approvals</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-2xl shadow cursor-pointer ${darkMode ? "bg-slate-700" : "bg-white"
                  }`}
              >
                <h3 className="font-bold flex gap-2 items-center">
                  <User size={18} />
                  {task.employee?.name}
                </h3>

                <p className="text-sm opacity-75">{task.department?.name}</p>

                <p className="mt-2">
                  <b>Task:</b> {task.title}
                </p>

                <p className={`mt-2 font-semibold ${statusColor[task.approval?.status]}`}>
                  Approval: {task.approval?.status}
                </p>


                <div className="flex justify-end gap-2 mt-3">
                  <button
                    disabled={task.approval?.status === "Approved"}
                    onClick={(e) => {
                      e.stopPropagation();
                      openActionModal(task, "Approved");
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg disabled:opacity-40"
                  >
                    Approve
                  </button>

                  <button
                    disabled={task.approval?.status === "Approved"}
                    onClick={(e) => {
                      e.stopPropagation();
                      openActionModal(task, "Rejected");
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg disabled:opacity-40"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className={`fixed right-0 top-0 h-full w-[360px] p-5 z-40 ${darkMode ? "bg-slate-800" : "bg-white"
              }`}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Task Details</h2>
              <button onClick={() => setSelectedTask(null)}>
                <X size={22} />
              </button>
            </div>

            <p>
              <b>Employee:</b> {selectedTask.employee?.name}
            </p>
            <p>
              <b>Department:</b> {selectedTask.department?.name}
            </p>
            <p className="mt-2">
              <b>Description:</b>
            </p>
            <p className="opacity-80">{selectedTask.description}</p>

            {/* Files */}
            {selectedTask.uploads?.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold flex items-center gap-2">
                  <FileText size={16} /> Files
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  {selectedTask.uploads.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className="text-blue-500 underline text-left text-sm"
                      onClick={() => setPreviewFile(f)}
                    >
                      {f.name} {/* Updated */}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      {actionTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? "bg-slate-800" : "bg-white"
              }`}
          >
            <h2 className="text-xl font-bold mb-4">
              {actionType === "Approved" ? "Approve Task" : "Reject Task"}
            </h2>

            <textarea
              className="w-full p-3 rounded-xl mb-4"
              placeholder="Manager comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActionTask(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                className={`px-4 py-2 text-white rounded-lg ${actionType === "Approved" ? "bg-green-600" : "bg-red-600"
                  }`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {previewFile && (() => {
          const fileUrl = previewFile.url.startsWith("http")
            ? previewFile.url
            : `http://localhost:5000${previewFile.url}`;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`w-full max-w-4xl h-[80vh] rounded-2xl relative flex flex-col ${darkMode ? "bg-slate-900 text-white" : "bg-white"
                  }`}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <h2 className="font-bold truncate">{previewFile.name}</h2>
                  <button onClick={() => setPreviewFile(null)}>
                    <X size={22} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-hidden p-4">
                  {/* IMAGE */}
                  {fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                    <img
                      src={fileUrl}
                      alt="preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  )}

                  {/* PDF */}
                  {fileUrl.endsWith(".pdf") && (
                    <iframe
                      src={fileUrl}
                      title="PDF Preview"
                      className="w-full h-full rounded-xl"
                    />
                  )}

                  {/* OTHER FILES */}
                  {!fileUrl.match(/\.(jpg|jpeg|png|gif|pdf)$/i) && (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <p>Preview not supported</p>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Download File
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default UniversalApprovalPanel;
