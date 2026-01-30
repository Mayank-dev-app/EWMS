import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  KeyRound,
  RefreshCcw,
  UserCog,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { useTheme } from "../../Hooks/DarkLight";

const mockUsers = [
  { id: 1, name: "Rahul Sharma", role: "Employee", email: "rahul@mail.com" },
  { id: 2, name: "Priya Verma", role: "Manager", email: "priya@mail.com" },
  { id: 3, name: "Aman Gupta", role: "Admin", email: "aman@mail.com" },
];

const roles = ["Employee", "Manager", "Admin"];

const AccessControl = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { darkMode } = useTheme();

  const filteredUsers = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`p-6 max-w-6xl mx-auto transition-all ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 flex items-center gap-3"
      >
        <ShieldCheck className="w-8 h-8 text-blue-500" />
        User Access Control
      </motion.h1>

      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-3 p-4 rounded-xl shadow border mb-6 transition
          ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-300"
          }
        `}
      >
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className={`w-full bg-transparent outline-none 
            ${darkMode ? "text-gray-200" : "text-gray-900"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      {/* USERS LIST */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredUsers.map((user) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setSelectedRole(user.role);
              setShowReset(false);
            }}
            className={`cursor-pointer p-4 rounded-xl shadow border transition
              ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }
              ${
                selectedUser?.id === user.id
                  ? "border-blue-500 shadow-lg"
                  : ""
              }
            `}
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-blue-400 mt-1 font-medium">{user.role}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* NO USER SELECTED */}
      {!selectedUser && (
        <p className="text-center text-gray-500 mt-10">
          Select a user to manage access & reset password.
        </p>
      )}

      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-8 p-6 rounded-xl shadow border transition 
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            }
          `}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <UserCog className="text-purple-500" />
              Manage Access for {selectedUser.name}
            </h3>

            {/* CANCEL SELECTED USER BUTTON */}
            <button
              onClick={() => setSelectedUser(null)}
              className="text-red-600 border border-red-500 px-4 py-1 rounded-lg hover:bg-red-600 hover:text-white transition"
            >
              Cancel
            </button>
          </div>

          {/* ROLE UPDATE */}
          <div className="mt-4">
            <label className="block font-medium mb-1">User Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={`p-2 border rounded-lg w-full transition
                ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }
              `}
            >
              {roles.map((role) => (
                <option
                  key={role}
                  value={role}
                  className={darkMode ? "bg-gray-700" : ""}
                >
                  {role}
                </option>
              ))}
            </select>

            <button
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
              onClick={() => alert("Update role logic pending")}
            >
              Update Role
            </button>
          </div>

          {/* PASSWORD RESET */}
          <div className="mt-10">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <KeyRound className="text-green-500" />
              Reset Password
            </h3>

            {!showReset ? (
              <button
                onClick={() => setShowReset(true)}
                className="mt-3 bg-gray-800 text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Reset Password
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <label className="block mb-1 font-medium">New Password</label>

                <div className="flex gap-3 items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`p-2 border rounded-lg w-full transition
                      ${
                        darkMode
                          ? "bg-gray-700 text-gray-100 border-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }
                    `}
                  />

                  {/* SHOW/HIDE ICON */}
                  {showPassword ? (
                    <EyeOff
                      className="cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    onClick={() => alert("Password reset logic pending")}
                  >
                    Save New Password
                  </button>

                  <button
                    className={`px-5 py-2 rounded-lg transition
                      ${
                        darkMode
                          ? "bg-gray-600 text-white hover:bg-gray-700"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }
                    `}
                    onClick={() => setShowReset(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default AccessControl;
