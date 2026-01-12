import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyForgotOtpApi, resendOtpApi } from "../../api/authApi";


import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";



const RESEND_COOLDOWN = 30; // seconds

const ForgotVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // timer
  const [cooldown, setCooldown] = useState<number>(RESEND_COOLDOWN);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-lg font-semibold">
          Error: Missing user ID.
        </p>
      </div>
    );
  }

  //  Countdown 
  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);


  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!otp.trim()) {
      setError("OTP cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await verifyForgotOtpApi({ userId, otp });
      navigate(`/auth/reset-password?userId=${userId}`);
    } catch (err: any) {

      setError(getAuthErrorMessage(err));
      // setError(err?.response?.data?.message || "Invalid OTP");

    } finally {
      setLoading(false);
    }
  };


  //
  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setError(null);
      setMessage(null);

      await resendOtpApi({ userId, ignoreVerified: true });

      setMessage("OTP resent successfully");
      setCooldown(RESEND_COOLDOWN); // restart timer
    } catch (err: any) {

      setError("Unable to resend OTP. Please try again.");
      // setError(err?.response?.data?.message || "Failed to resend OTP");

    } finally {
      setResending(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Verify OTP
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-3 text-sm text-green-200 bg-green-500/20 border border-green-400/30 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Timer / Resend */}
        <div className="text-center mt-4 text-sm">
          {cooldown > 0 ? (
            <p className="text-white/60">
              Resend OTP in <span className="text-white">{cooldown}s</span>
            </p>
          ) : (
            <button
              disabled={resending}
              onClick={handleResendOtp}
              className="text-white hover:underline disabled:opacity-50"
            >
              {resending ? "Resending OTP..." : "Resend OTP"}
            </button>
          )}
        </div>

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

export default ForgotVerifyOtp;









// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
//     <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Verify OTP
//       </h2>

//       {error && (
//         <p className="bg-red-100 text-red-600 p-2 rounded text-sm text-center mb-4">
//           {error}
//         </p>
//       )}

//       {message && (
//         <p className="bg-green-100 text-green-600 p-2 rounded text-sm text-center mb-4">
//           {message}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700 mb-1">Enter OTP</label>
//           <input
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Enter the 6-digit OTP"
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>
//       </form>

//       {/*  Timer + Resend  */}
//       <div className="text-center mt-4">
//         {cooldown > 0 ? (
//           <p className="text-gray-600 text-sm">
//             Resend OTP in {cooldown}s
//           </p>
//         ) : (
//           <button
//             disabled={resending}
//             onClick={handleResendOtp}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             {resending ? "Resending OTP..." : "Resend OTP"}
//           </button>
//         )}
//       </div>

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







