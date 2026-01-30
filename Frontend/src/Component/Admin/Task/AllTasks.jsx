import { motion } from "framer-motion";
import { Plus, Search, Filter, Trash2, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api"; // Axios instance

const AllTask = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [taskList, setTaskList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // FETCH TASKS FROM API
  const fetchTasks = async () => {
    try {
      const res = await api.get("/admin/tasks");
      // Ensure employee is populated as { name: "..." }
      setTaskList(res.data.tasks || []);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // COUNTS
  const completedCount = taskList.filter((t) => t.status === "Completed").length;
  const pendingCount = taskList.filter((t) => t.status === "Pending").length;
  const In_Progress = taskList.filter((t) => t.status === "In Progress").length;

  // DELETE SELECTED TASKS
  const deleteSelected = async () => {
    try {
      await Promise.all(selectedTasks.map((id) => api.delete(`/tasks/${id}`)));
      setTaskList((prev) => prev.filter((t) => !selectedTasks.includes(t._id)));
      setSelectedTasks([]);
      setSelectMode(false);
    } catch (err) {
      console.log("Error deleting tasks:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // FILTERED TASKS
  const filteredTasks = taskList.filter((t) => {
    const matchStatus = filterStatus === "All" || t.status === filterStatus;

    const matchSearch =
      (t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (t.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (t.priority?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    return matchStatus && matchSearch;
  });

  return (
    <div className={`p-6 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        {/* <div className="flex gap-3">
          <button
            onClick={() => setSelectMode(!selectMode)}
            className={`px-4 py-2 rounded-xl border shadow flex items-center gap-2 transition
              ${selectMode ? "bg-red-500 text-white" : darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-gray-200 text-gray-700"}`}
          >
            <CheckSquare size={18} />
            {selectMode ? "Cancel Select" : "Select Mode"}
          </button>

          <button
            onClick={() => navigate("/admin/tasks/create")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div> */}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className={`flex items-center px-4 py-2 rounded-xl shadow border w-full sm:w-80 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className={`ml-3 w-full outline-none ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`px-4 py-2 rounded-xl shadow flex items-center gap-2 transition ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-200"}`}
          >
            <Filter size={18} />
            {filterStatus}
          </button>

          {filterOpen && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`absolute shadow-xl rounded-xl border w-40 mt-2 z-20 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              {["All", "Pending", "Completed", "In Progress"].map((status) => (
                <button
                  key={status}
                  onClick={() => { setFilterStatus(status); setFilterOpen(false); }}
                  className={`w-full px-4 py-2 text-left hover:${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  {status}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* TASK TABLE */}
      <div className={`rounded-2xl p-6 shadow border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif font-bold">All Tasks</h2>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl shadow"><span className="font-semibold">Completed:</span> {completedCount}</div>
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl shadow"><span className="font-semibold">Pending:</span> {pendingCount}</div>
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl shadow"><span className="font-semibold">In Progress</span> {In_Progress}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} text-gray-300`}>
                {selectMode && <th className="p-3 border">Select</th>}
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Employee</th>
                <th className="p-3 border">Priority</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Approval</th>   {/* ✅ NEW */}
                <th className="p-3 border">Task Assign Date</th>
              </tr>
            </thead>


            <tbody>
              {filteredTasks.map((task, i) => (
                <motion.tr key={task._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className={`border transition cursor-pointer ${darkMode ? "border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"}`}
                  // onClick={() => !selectMode && navigate(`${task._id}`)}
                >
                  {selectMode && <td className="p-3 border" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedTasks.includes(task._id)} onChange={() => toggleSelect(task._id)} />
                  </td>}
                  <td className="p-3 border font-medium">{task.title}</td>
                  <td className="p-3 border">{task.employee?.name || "N/A"}</td>
                  <td className="p-3 border"><span className={`px-3 py-1 rounded-full text-sm ${task.priority === "High" ? "bg-red-100 text-red-600" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}>{task.priority}</span></td>
                  <td className="p-3 border"><span className={`px-3 py-1 rounded-full text-sm ${task.status === "Completed" ? "bg-green-100 text-green-600" : task.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}>{task.status}</span></td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                       ${task.approval?.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : task.approval?.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {task.approval?.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 border">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectMode && selectedTasks.length > 0 && (
          <button onClick={deleteSelected} className="mt-4 flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 shadow">
            <Trash2 size={18} />
            Delete Selected ({selectedTasks.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default AllTask;
