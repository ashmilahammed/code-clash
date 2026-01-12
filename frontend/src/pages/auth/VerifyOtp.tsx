import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../../api/authApi";

import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";



const VerifyOtp = () => {

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30); // second

  const navigate = useNavigate();
  const location = useLocation();


  // userId from URL: 
  // /auth/verify-otp?userId=123&email=user@example.com&otp=654321
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const email = params.get("email");
  const otpFromLogin = params.get("otp");

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
          <p className="text-red-600">Error: Missing userId</p>
          <button
            className="mt-4 text-blue-600 hover:underline"
            onClick={() => navigate("/auth/register")}
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }


  // OTP console coming from login redirect
  useEffect(() => {
    if (otpFromLogin) console.log("OTP from login redirect =", otpFromLogin);
  }, [otpFromLogin]);

  useEffect(() => {
    if (otpFromLogin) setOtp(otpFromLogin);
  }, [otpFromLogin]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);


  //
  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otp.trim()) {
      setError("OTP cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await verifyOtpApi({ userId, otp });
      navigate("/auth/login", { replace: true });
    } catch (err: any) {

      setError(getAuthErrorMessage(err));
      // setError(err?.response?.data?.message || "Invalid OTP. Try again.");

    } finally {
      setLoading(false);
    }
  };


  //
  const resendOtp = async () => {
    try {
      setError(null);
      setSuccess(null);
      setTimer(30);

      await resendOtpApi({ userId });
      setSuccess("A new OTP has been sent to your email.");
    } catch (err: any) {

      // setError(err?.response?.data?.message || "Failed to resend OTP.");
      setError("Unable to resend OTP. Please try again.");
    }
  };






  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-white mb-2">
          Verify OTP
        </h2>

        {/* Email Info */}
        {email && (
          <p className="text-center text-white/80 mb-3">
            Verification required for{" "}
            <span className="font-medium text-white">{email}</span>
          </p>
        )}

        <p className="text-white/60 text-sm text-center mb-6">
          Enter the OTP sent to your email
        </p>

        {/* Form */}
        <form onSubmit={submitOtp} className="space-y-4">

          {/* Error */}
          {error && (
            <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-3 text-sm text-green-200 bg-green-500/20 border border-green-400/30 rounded-lg text-center">
              {success}
            </div>
          )}

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center"
          />

          <button
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Timer / Resend */}
        <div className="text-center mt-4 text-sm">
          {timer > 0 ? (
            <p className="text-white/60">
              Resend OTP in <span className="text-white">{timer}s</span>
            </p>
          ) : (
            <button
              className="text-white hover:underline"
              onClick={resendOtp}
            >
              Resend OTP
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

export default VerifyOtp;







// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
//     <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

//       <h2 className="text-2xl font-semibold text-center mb-2">Verify OTP</h2>

//       {email && (
//         <p className="text-center text-gray-600 mb-3">
//           Verification required for <strong>{email}</strong>
//         </p>
//       )}

//       <p className="text-gray-500 text-sm text-center mb-6">
//         Enter the OTP sent to your email.
//       </p>

//       <form onSubmit={submitOtp} className="space-y-4">

//         {error && (
//           <p className="text-red-600 bg-red-100 p-2 rounded text-sm text-center">
//             {error}
//           </p>
//         )}

//         {success && (
//           <p className="text-green-600 bg-green-100 p-2 rounded text-sm text-center">
//             {success}
//           </p>
//         )}

//         <input
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter OTP"
//           className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
//         >
//           {loading ? "Verifying..." : "Verify"}
//         </button>
//       </form>

//       {/* Timer + Resend */}
//       <div className="text-center mt-4">
//         {timer > 0 ? (
//           <p className="text-gray-600 text-sm">Resend OTP in {timer}s</p>
//         ) : (
//           <button
//             className="text-blue-600 hover:underline text-sm"
//             onClick={resendOtp}
//           >
//             Resend OTP
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












