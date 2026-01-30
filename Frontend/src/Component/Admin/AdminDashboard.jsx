import { motion } from "framer-motion";
import { Users, Building2, ClipboardCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Hooks/DarkLight";
import { useEffect, useState } from "react";
import api from "../api/api";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const [counts, setCounts] = useState({
        totalEmployees: 0,
    totalDepartments: 0,
    });

    const [recentTasks, setRecentTasks] = useState([]); // 👈 recent tasks

    // 🕒 LIVE CLOCK STATE
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setTime(formatted);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    // Fetch Dashboard Counts
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await api.get("/admin/dashboard-counts");
                setCounts({
                    totalEmployees: res.data.totalEmployees,
                    totalDepartments: res.data.totalDepartments,
                    totalTask : res.data.totalTasks,
                });
            } catch (error) {
                console.log("Dashboard Count Error:", error);
            }
        };
        fetchCounts();
    }, []);

    // 👇 Fetch ONLY 4 Recent Tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get("/admin/tasks?limit=4");
                setRecentTasks(res.data.tasks);
            } catch (err) {
                console.log("Recent Task Error:", err);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div
            className={`h-screen p-6 overflow-auto transition-all duration-300 ${
                darkMode
                    ? "bg-linear-to-b from-slate-900 to-slate-800 text-gray-100"
                    : "bg-linear-to-b from-gray-100 to-gray-200 text-gray-900"
            }`}
        >
            {/* TOP BAR */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex justify-between items-center mb-8 backdrop-blur-lg p-4 rounded-2xl shadow-sm border ${
                    darkMode
                        ? "bg-white/10 border-white/10"
                        : "bg-white/60 border-gray-300"
                }`}
            >
                {/* LEFT: Welcome */}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bold">
                        Welcome,{" "}
                        <span
                            className="text-blue-500 cursor-pointer"
                            onClick={() => navigate("/admin/profile")}
                        >
                            Admin
                        </span>
                    </h2>
                    <p className="text-sm opacity-70 -mt-1">
                        Your workspace overview
                    </p>
                </div>

                {/* RIGHT: Live Clock */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ rotateY: 8, rotateX: 5, scale: 1.05 }}
                    className={`relative px-6 py-3 rounded-2xl cursor-default shadow-lg backdrop-blur-xl border flex items-center gap-3 select-none ${
                        darkMode
                            ? "bg-white/10 border-white/20 text-blue-300 shadow-blue-500/20"
                            : "bg-white/40 border-gray-300 text-blue-700 shadow-blue-300/30"
                    }`}
                    style={{ transformStyle: "preserve-3d", perspective: "800px" }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="z-10"
                    >
                        <Clock size={26} className="text-blue-400" />
                    </motion.div>

                    <span className="text-lg font-bold tracking-wide z-10">
                        {time}
                    </span>
                </motion.div>
            </motion.div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {[
                    {
                        label: "Total Employees",
                        value: counts.totalEmployees,
                        icon: Users,
                        color: "text-blue-500",
                        route: "/admin/employees",
                    },
                    {
                        label: "Departments",
                        value: counts.totalDepartments,
                        icon: Building2,
                        color: "text-green-500",
                        route: "/admin/departments",
                    },
                    {
                        label: "Total Tasks",
                        value: counts.totalTask,
                        icon: ClipboardCheck,
                        color: "text-purple-500",
                        route: "/admin/tasks",
                    },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        onClick={() => navigate(card.route)}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.15, type: "spring", stiffness: 90 }}
                        whileHover={{
                            scale: 1.04,
                        }}
                        className={`p-6 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
                            darkMode
                                ? "bg-slate-800 border-white/10 text-gray-100"
                                : "bg-white border text-gray-800"
                        }`}
                    >
                        <motion.div whileHover={{ rotate: 10 }}>
                            <card.icon size={45} className={card.color} />
                        </motion.div>

                        <div>
                            <p className="text-sm opacity-70">{card.label}</p>
                            <h3 className="text-3xl font-bold">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* RECENT TASKS TABLE */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`p-6 rounded-2xl shadow border ${
                    darkMode
                        ? "bg-slate-800 border-white/10 text-gray-100"
                        : "bg-white border text-gray-900"
                }`}
            >
                <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>

                <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr
                                className={`${
                                    darkMode
                                        ? "bg-slate-700 text-gray-100"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                <th className="p-3 border">Task</th>
                                <th className="p-3 border">Employee</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Task Assign Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentTasks.map((task, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        backgroundColor: darkMode
                                            ? "rgba(255,255,255,0.05)"
                                            : "rgba(211,243,243,1)",
                                    }}
                                    className={`border transition-all ${
                                        darkMode
                                            ? "border-white/10 text-gray-100"
                                            : "border-gray-300 text-gray-800"
                                    }`}
                                >
                                    <td className="p-3 border">{task.title}</td>
                                    <td className="p-3 border">
                                        {task.employee?.name || "N/A"}
                                    </td>
                                    <td className="p-3 border">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                task.status === "Completed"
                                                    ? darkMode
                                                        ? "bg-green-900 text-green-300"
                                                        : "bg-green-100 text-green-600"
                                                    : task.status === "Pending"
                                                    ? darkMode
                                                        ? "bg-yellow-900 text-yellow-300"
                                                        : "bg-yellow-100 text-yellow-600"
                                                    : darkMode
                                                        ? "bg-blue-900 text-blue-300"
                                                        : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="p-3 border">
                                        {task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString("en-IN")
                                            : "N/A"}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* View All Tasks Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => navigate("/admin/tasks")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        View All Tasks →
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
