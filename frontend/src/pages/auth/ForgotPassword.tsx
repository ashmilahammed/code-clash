import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../api/authApi";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email });

      // const userId = res.data?.userId;
      const userId = res.data?.data?.userId;
      if (!userId) {
        setError("Unable to process request. Try again.");
        return;
      }

      navigate(`/auth/forgot-verify-otp?userId=${userId}`);
    } catch (err: any) {

      // const msg =
      //   err?.response?.data?.message || "Something went wrong. Try again.";
      // setError(msg);
      setError("No account is registered with this email.");

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
          Forgot Password
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
            type="email"
            value={email}
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;








// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
//     <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Forgot Password
//       </h2>

//       {error && (
//         <p className="bg-red-100 text-red-600 p-2 rounded text-sm text-center mb-4">
//           {error}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* Email Input */}
//         <div>
//           <label className="block text-gray-700 mb-1">Email Address</label>
//           <input
//             type="email"
//             value={email}
//             placeholder="you@example.com"
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
//         >
//           {loading ? "Sending OTP..." : "Send OTP"}
//         </button>
//       </form>

//       {/* Back to login */}
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