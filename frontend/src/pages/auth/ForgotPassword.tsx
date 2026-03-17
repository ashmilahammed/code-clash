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





  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] px-4">
  //     {/* Glass Card */}
  //     <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

  //       {/* Title */}
  //       <h2 className="text-2xl font-semibold text-center text-white mb-6">
  //         Forgot Password
  //       </h2>

  //       {/* Error */}
  //       {error && (
  //         <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
  //           {error}
  //         </div>
  //       )}

  //       {/* Form */}
  //       <form onSubmit={handleSubmit} className="space-y-4">

  //         <input
  //           type="email"
  //           value={email}
  //           placeholder="E-mail"
  //           onChange={(e) => setEmail(e.target.value)}
  //           className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  //         />

  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
  //         >
  //           {loading ? "Sending OTP..." : "Send OTP"}
  //         </button>
  //       </form>

  //       {/* Back to Login */}
  //       <div className="text-center mt-6">
  //         <button
  //           onClick={() => navigate("/auth/login")}
  //           className="text-sm text-white/70 hover:text-white transition hover:underline"
  //         >
  //           ← Back to Login
  //         </button>
  //       </div>

  //     </div>
  //   </div>
  // );



return (
  <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">

    {/* ⭐ Linear Base Gradient */}
    <div className="absolute inset-0 -z-20 bg-linear-to-br from-[#0f1c3d] via-[#0b1430] to-[#1a0f3d]" />

    {/* ⭐ Radial Glow Background */}
    <div className="absolute inset-0 -z-10 pointer-events-none">

      {/* Blue Glow */}
      <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-blue-500/50 rounded-full blur-[180px]" />

      {/* Purple Glow */}
      <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-purple-500/50 rounded-full blur-[180px]" />

    </div>

    {/* ⭐ Card */}
    <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8">

      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Forgot Password
      </h2>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-600 to-cyan-500 py-3 rounded-lg font-bold text-white hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/auth/login")}
          className="text-sm text-slate-400 hover:text-white transition hover:underline"
        >
          ← Back to Login
        </button>
      </div>

    </div>

  </div>
);

//   return (
//   <div className="min-h-screen flex items-center justify-center bg-[#050B18] px-4">

//     <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8">

//       {/* Title */}
//       <h2 className="text-2xl font-bold text-white text-center mb-6">
//         Forgot Password
//       </h2>

//       {/* Error */}
//       {error && (
//         <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
//           {error}
//         </div>
//       )}

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">

//         <input
//           type="email"
//           value={email}
//           placeholder="Enter your email"
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 py-3 rounded-lg font-bold text-white hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
//         >
//           {loading ? "Sending OTP..." : "Send OTP"}
//         </button>

//       </form>

//       {/* Back */}
//       <div className="text-center mt-6">
//         <button
//           onClick={() => navigate("/auth/login")}
//           className="text-sm text-slate-400 hover:text-white transition hover:underline"
//         >
//           ← Back to Login
//         </button>
//       </div>

//     </div>

//   </div>
// );

};

export default ForgotPassword;








