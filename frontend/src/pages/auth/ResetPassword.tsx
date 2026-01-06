import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi";


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
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              placeholder="Re-enter password"
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;














// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { resetPasswordApi } from "../../api/authApi";


// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const userId = new URLSearchParams(location.search).get("userId");

//   if (!userId) {
//     return <p>Error: Missing user ID.</p>;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!password || !confirm) {
//       setError("Please fill all fields");
//       return;
//     }

//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);
//       await resetPasswordApi({ userId, password });

//       alert("Password reset successful! Please login.");
//       navigate("/auth/login");

//     } catch (err: any) {
//       const msg = err?.response?.data?.message || "Something went wrong";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Reset Password</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <input
//         type="password"
//         placeholder="New password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Confirm password"
//         value={confirm}
//         onChange={(e) => setConfirm(e.target.value)}
//       />

//       <button disabled={loading}>
//         {loading ? "Saving..." : "Reset Password"}
//       </button>
//     </form>
//   );
// };

// export default ResetPassword;
