import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi";

import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim() || !confirm.trim()) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({ userId, password });

      alert("Password reset successful!");
      
      navigate("/auth/login");
    } catch (err: any) {

      setError(getAuthErrorMessage(err));
      // setError(err?.response?.data?.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
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

          <input
            type="password"
            value={password}
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            value={confirm}
            placeholder="Confirm new password"
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/auth/login")}
            className="text-sm text-white/70 hover:text-white transition hover:underline"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );



};

export default ResetPassword;









// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
//     <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Reset Password
//       </h2>

//       {error && (
//         <p className="text-red-600 bg-red-100 p-2 rounded text-sm mb-4 text-center">
//           {error}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">

//         <div>
//           <label className="block text-gray-700 mb-1">New Password</label>
//           <input
//             type="password"
//             value={password}
//             placeholder="Enter new password"
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 mb-1">
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             value={confirm}
//             placeholder="Re-enter password"
//             onChange={(e) => setConfirm(e.target.value)}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
//         >
//           {loading ? "Saving..." : "Reset Password"}
//         </button>
//       </form>

//       <div className="text-center mt-4">
//         <button
//           onClick={() => navigate("/auth/login")}
//           className="text-blue-600 hover:underline text-sm"
//         >
//           ← Back to Login
//         </button>
//       </div>

//     </div>
//   </div>
// );
