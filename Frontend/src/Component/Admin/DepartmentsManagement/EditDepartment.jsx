import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, ClipboardList } from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";
import api from "../../api/api"; // ✅ Your Axios Instance

const EditDepartment = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(""); // Department Icon
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);


  // ==========================
  // Fetch Department by ID
  // ==========================
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await api.get(`/admin/department/${id}`);

        if (res.data.success) {
          setName(res.data.department.name);
          setDescription(res.data.department.description || "");
          setIcon(res.data.department.icon || "");
        }
      } catch (error) {
        console.log("Error fetching department:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  // ==========================
  // Save / Update Department
  // ==========================
  const handleUpdate = async () => {
    try {
      setButtonLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("icon", icon);

      const res = await api.put(
        `/admin/department/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      console.log(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        Loading department...
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 mb-6 hover:underline transition ${darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-8 max-w-2xl mx-auto shadow-lg transition-all border
          ${darkMode
            ? "bg-gray-800 border-gray-700 shadow-black/40"
            : "bg-white border-gray-200 shadow"
          }
        `}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ClipboardList
            size={28}
            className={darkMode ? "text-indigo-400" : "text-indigo-600"}
          />
          Edit Department
        </h2>

        {/* Form Inputs */}
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Department Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full mt-2 px-4 py-2 rounded-xl border outline-none transition 
                ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-200"
                }
              `}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full mt-2 px-4 py-2 rounded-xl border outline-none transition
                ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-200"
                }
              `}
            ></textarea>
          </div>

          {/* Icon */}
          <div>
            <label className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Icon (Upload Image)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIcon(e.target.files[0])}
              className={`w-full mt-2 px-4 py-2 rounded-xl border outline-none transition 
                 ${darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-200"
                }
                `}
            />
          </div>


          {/* Save Button */}
          <motion.button
            whileHover={!buttonLoading ? { scale: 1.03 } : {}}
            whileTap={!buttonLoading ? { scale: 0.9 } : {}}
            onClick={handleUpdate}
            disabled={buttonLoading}
            className={`flex items-center justify-center gap-2 w-full py-3 text-lg rounded-xl shadow transition
    ${darkMode
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-black/50"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow"
              }
    ${buttonLoading ? "opacity-50 cursor-not-allowed" : ""}
  `}
          >
            {buttonLoading ? "Saving..." : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
};

export default EditDepartment;
