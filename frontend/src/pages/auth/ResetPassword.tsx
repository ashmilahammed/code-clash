import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordApi } from "../../api/authApi";
import toast from "react-hot-toast";

import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const userId = new URLSearchParams(location.search).get("userId");

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-600 text-lg font-semibold">
          Error: Missing user ID.
        </p>
      </div>
    );
  }

  const validate = () => {
    if (!password.trim() || !confirm.trim()) {
      setError("Please fill all fields.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return false;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return false;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    try {
      setLoading(true);
      await resetPasswordApi({ userId, password });

      toast.success("Password reset successful!");
      
      navigate("/login");
    } catch (err: any) {

      setError(getAuthErrorMessage(err));
      // setError(err?.response?.data?.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  };




  return (
  <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">

    {/* Linear Base Gradient */}
    <div className="absolute inset-0 -z-20 bg-linear-to-br from-[#0f1c3d] via-[#0b1430] to-[#1a0f3d]" />

    {/*  Radial Glow */}
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-blue-500/50 rounded-full blur-[180px]" />
      <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-purple-500/50 rounded-full blur-[180px]" />
    </div>

    {/*  Card */}
    <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8">

      {/* Title */}
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Reset Password
      </h2>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            placeholder="Confirm new password"
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-600 to-cyan-500 py-3 rounded-lg font-bold text-white hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>

      </form>

      {/* Back */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-slate-400 hover:text-white transition hover:underline"
        >
          ← Back to Login
        </button>
      </div>

    </div>

  </div>
);


};

export default ResetPassword;







