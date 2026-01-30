import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api/api"; 

const VerifyAndChangePassword = () => {
    const [step, setStep] = useState(1);

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [resendTimer, setResendTimer] = useState(30);
    const [resendLoading, setResendLoading] = useState(false);

    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return (
            <div className="h-screen flex justify-center items-center flex-col gap-3">
                <p className="text-red-600 text-lg font-semibold">
                    Email missing! Please restart password reset.
                </p>
                <Link to="/forgot-password" className="text-blue-600 underline">
                    Go Back
                </Link>
            </div>
        );
    }

    // Timer logic
    useEffect(() => {
        if (resendTimer <= 0) return;

        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [resendTimer]);

    // Verify OTP
    const handleVerify = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/verify-otp", { email, otp });

            setMessage("Code verified successfully!");

            setTimeout(() => {
                setStep(2);
            }, 800);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP!");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        setResendLoading(true);
        setError("");
        setMessage("");

        try {
            await api.post("/auth/send-otp", { email });

            setMessage("New OTP sent to your email.");
            setResendTimer(30);
        } catch (err) {
            setError("Couldn't resend OTP.");
        } finally {
            setResendLoading(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/change-password", { email, password });

            setMessage("Password changed successfully!");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-white">
            <div className="bg-white px-8 py-10 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {step === 1 ? "Verify Code" : "Change Password"}
                </h2>

                {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleVerify}>
                        <label className="font-medium text-gray-700">Enter Verification Code</label>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full px-4 py-2 mt-2 mb-4 rounded-lg border border-gray-300"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="text-blue-600 underline disabled:text-gray-400"
                                onClick={handleResend}
                                disabled={resendTimer > 0 || resendLoading}
                            >
                                {resendLoading
                                    ? "Sending..."
                                    : resendTimer > 0
                                        ? `Resend in ${resendTimer}s`
                                        : "Resend OTP"}
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleChangePassword}>
                        <label className="font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-2 mb-4 rounded-lg border border-gray-300"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <label className="font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-2 mb-4 rounded-lg border border-gray-300"
                            placeholder="Confirm new password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Change Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VerifyAndChangePassword;
