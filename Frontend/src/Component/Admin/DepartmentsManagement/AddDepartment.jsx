import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Image as ImgIcon } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api";
import { useNavigate } from "react-router-dom"; // 🔥 import useNavigate

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { darkMode } = useTheme();
  const navigate = useNavigate(); // 🔥 initialize navigate

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", departmentName);
    formData.append("description", description);
    if (icon) formData.append("icon", icon);

    try {
      const res = await api.post("/admin/department/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: res.data.message });

      // Reset fields
      setDepartmentName("");
      setDescription("");
      setIcon(null);
      setPreview(null);

      // 🔥 Navigate to Departments page after 1 second
      setTimeout(() => {
        navigate("/admin/departments");
      }, 1000);

    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 flex justify-center min-h-screen transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-xl p-8 rounded-2xl shadow-lg border transition-all ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}>

        <div className="flex items-center gap-3 mb-6">
          <Building2 size={32} className={darkMode ? "text-indigo-400" : "text-indigo-600"} />
          <h2 className="text-3xl font-semibold font-serif">Add Department</h2>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Department Name</label>
            <input
              type="text"
              required
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="e.g., Human Resources"
              className={`w-full px-4 py-2 rounded-xl shadow-sm outline-none border transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 focus:ring focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-800 focus:ring focus:ring-indigo-200"}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Handle recruitment and training"
              className={`w-full px-4 py-2 rounded-xl shadow-sm outline-none border transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 focus:ring focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-800 focus:ring focus:ring-indigo-200"}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Department Icon (Optional)</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="icon preview" className="w-16 h-16 rounded-full object-cover border shadow-md" />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <ImgIcon className={darkMode ? "text-gray-300" : "text-gray-500"} size={28} />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleIconChange} className="cursor-pointer" />
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-lg shadow transition ${darkMode ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
            <Plus size={20} />
            {loading ? "Adding..." : "Add Department"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDepartment;
