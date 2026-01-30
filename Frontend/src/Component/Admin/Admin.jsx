import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Shield, Pencil, Lock, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../Hooks/DarkLight";
import api from "../api/api";

const AdminProfile = () => {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Email Validation
  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  // OTP System States
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Email Validation Regex
  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });

    setIsOtpVerified(false); // new email -> verify again

    if (!validateEmail(value)) {
      setIsEmailValid(false);
      setEmailMessage("❌ Invalid email format");
    } else {
      setIsEmailValid(true);
      setEmailMessage("✔ Valid email");
    }
  };

  // 🔥 Fetch Admin Data
  const loadAdmin = async () => {
    try {
      const res = await api.get("/admin/get");
      const adminData = res.data.admin[0];

      setAdmin(adminData);
      setFormData({
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        password: adminData.password,
        role: adminData.role,
      });
    } catch (error) {
      console.log("Error loading admin:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  // 🔵 SEND OTP BUTTON
  const sendOtp = async () => {
    if (!validateEmail(formData.email)) {
      setEmailMessage("❌ Enter valid email first");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await api.post("/admin/send-otp", {
        email: formData.email,
      });

      if (res.data.success) {
        setShowOtpField(true);
        setOtpMessage("📩 OTP sent to your email!");
      }
    } catch (error) {
      setOtpMessage("❌ Failed to send OTP");
    }
    setOtpLoading(false);
  };

  // 🟢 VERIFY OTP
  const verifyOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await api.post("/admin/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      if (res.data.success) {
        setIsOtpVerified(true);
        setOtpMessage("✔ OTP Verified Successfully!");
      }
    } catch (error) {
      setOtpMessage("❌ Invalid OTP");
      setIsOtpVerified(false);
    }
    setOtpLoading(false);
  };

  // 🟣 UPDATE ADMIN (only if OTP verified)
  const handleUpdate = async () => {
    if (!isOtpVerified) {
      alert("Please verify OTP before saving changes!");
      return;
    }

    try {
      await api.put(`/admin/update-admin/${admin._id}`, formData);

      alert("Profile updated successfully!");
      setAdmin({ ...admin, ...formData });
      setEditing(false);

    } catch (error) {
      console.log("Error updating admin:", error);
      alert("Failed to update profile!");
    }
  };

  if (loading)
    return <div className="text-center p-10 text-xl">Loading Admin Data...</div>;

  if (!admin)
    return <div className="text-center p-10 text-xl text-red-500">Failed to load admin profile!</div>;

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-slate-900 text-white" : "bg-gray-100"}`}>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-6">
        Admin Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl shadow-xl p-6 max-w-2xl mx-auto ${isDark ? "bg-slate-800" : "bg-white"}`}
      >
        {!editing ? (
          <>
            {/* PROFILE VIEW */}
            <div className="flex items-center gap-5 mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold 
                ${isDark ? "bg-blue-600" : "bg-blue-100 text-blue-700"}`}
              >
                {admin.name.charAt(0)}
              </div>

              <div>
                <h2 className="text-2xl font-bold">{admin.name}</h2>
                <p>{admin.role}</p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="ml-auto px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400"
              >
                <Pencil size={18} /> Edit
              </button>
            </div>

            {/* DETAILS */}
            <div className="space-y-4 text-lg">
              <div className="flex items-center gap-3">
                <Mail size={20} /> {admin.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} /> {admin.phone}
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} /> {admin.role}
              </div>
              {/* <div className="flex items-center gap-3">
                <Lock size={20} />
                {showPassword ? admin.password : "••••••••"}

                <button onClick={() => setShowPassword(!showPassword)} className="ml-2">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button> 
              </div>*/}
            </div>
          </>
        ) : (
          <>
            {/* EDIT MODE */}
            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  className={`w-full mt-1 px-4 py-2 rounded-lg ${isDark ? "bg-slate-700" : "bg-gray-100"}`}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* EMAIL + SEND OTP */}
              <div>
                <label>Email</label>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-2 rounded-lg border 
                      ${isEmailValid ? "border-green-500" : "border-red-500"}
                      ${isDark ? "bg-slate-700" : "bg-gray-100"}
                    `}
                  />

                  <button
                    onClick={sendOtp}
                    className="px-3 py-2 rounded bg-blue-600 text-white"
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>

                <p className={`text-sm mt-1 ${isEmailValid ? "text-green-400" : "text-red-400"}`}>
                  {emailMessage}
                </p>
              </div>

              {/* OTP FIELD */}
              {showOtpField && (
                <div>
                  <label>Enter OTP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        isDark ? "bg-slate-700" : "bg-gray-100"
                      }`}
                    />

                    <button
                      onClick={verifyOtp}
                      className="px-3 py-2 rounded bg-green-600 text-white"
                      disabled={otpLoading}
                    >
                      {otpLoading ? "Checking..." : "Verify"}
                    </button>
                  </div>

                  <p className="text-sm mt-1">{otpMessage}</p>
                </div>
              )}

              {/* PHONE */}
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  className={`w-full mt-1 px-4 py-2 rounded-lg ${isDark ? "bg-slate-700" : "bg-gray-100"}`}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* PASSWORD
              <div>
                <label>Enter New Password</label>
                <input
                  type="text"
                  value={formData.password}
                  className={`w-full mt-1 px-4 py-2 rounded-lg ${isDark ? "bg-slate-700" : "bg-gray-100"}`}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div> */}
            </div>

            {/* SAVE + CANCEL */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-500 text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={!isOtpVerified}
                className={`px-4 py-2 rounded-lg text-white ${
                  isOtpVerified ? "bg-green-600" : "bg-gray-400"
                }`}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProfile;
