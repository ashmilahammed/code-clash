
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyForgotOtpApi, resendOtpApi } from "../../api/authApi";

const RESEND_COOLDOWN = 30;//sec


const ForgotVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

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
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setError(null);
      setMessage(null);

      await resendOtpApi({ userId, ignoreVerified: true });

      setMessage("OTP resent successfully");
      setCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Verify OTP
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-sm text-center mb-4">
            {error}
          </p>
        )}

        {message && (
          <p className="bg-green-100 text-green-600 p-2 rounded text-sm text-center mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-gray-700 mb-1">Enter OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the 6-digit OTP"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="text-center mt-4">
          <p
            onClick={
              cooldown > 0 || resending ? undefined : handleResendOtp
            }
            className={`text-sm cursor-pointer ${
              cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:underline"
            }`}
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : resending
              ? "Resending OTP..."
              : "Resend OTP"}
          </p>
        </div>

        {/* Back to Login */}
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

export default ForgotVerifyOtp;








// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { verifyForgotOtpApi, resendOtpApi } from "../../api/authApi";



// const RESEND_COOLDOWN = 30; // seconds

// const ForgotVerifyOtp = () => {
//     const [otp, setOtp] = useState("");
//     const [error, setError] = useState<string | null>(null);
//     const [message, setMessage] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [resending, setResending] = useState(false);
//     const [cooldown, setCooldown] = useState(0);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const userId = new URLSearchParams(location.search).get("userId");

//     if (!userId) {
//         return <p>Error: User ID missing. Go back and try again.</p>;
//     }

//     // countdown timer
//     useEffect(() => {
//         if (cooldown <= 0) return;

//         const timer = setInterval(() => {
//             setCooldown((prev) => prev - 1);
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [cooldown]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setMessage(null);

//         if (!otp.trim()) {
//             setError("OTP cannot be empty");
//             return;
//         }

//         try {
//             setLoading(true);
//             await verifyForgotOtpApi({ userId, otp });
//             navigate(`/auth/reset-password?userId=${userId}`);
//         } catch (err: any) {
//             setError(err?.response?.data?.message || "Invalid OTP");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResendOtp = async () => {
//         if (cooldown > 0) return;

//         try {
//             setResending(true);
//             setError(null);
//             setMessage(null);

//             await resendOtpApi({ userId, ignoreVerified: true, });

//             setMessage("OTP resent successfully");
//             setCooldown(RESEND_COOLDOWN);

//         } catch (err: any) {
//             setError(err?.response?.data?.message || "Failed to resend OTP");
//         } finally {
//             setResending(false);
//         }
//     };


//     //
//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Verify OTP</h2>

//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {message && <p style={{ color: "green" }}>{message}</p>}

//             <input
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//             />

//             <button type="submit" disabled={loading}>
//                 {loading ? "Verifying..." : "Verify OTP"}
//             </button>

//             {/* Resend OTP */}
//             <p
//                 onClick={cooldown > 0 || resending ? undefined : handleResendOtp}
//                 style={{
//                     marginTop: "10px",
//                     color: cooldown > 0 ? "gray" : "blue",
//                     cursor: cooldown > 0 ? "not-allowed" : "pointer",
//                 }}
//             >
//                 {cooldown > 0
//                     ? `Resend OTP in ${cooldown}s`
//                     : resending
//                         ? "Resending OTP..."
//                         : "Resend OTP"}
//             </p>
//         </form>
//     );
// };

// export default ForgotVerifyOtp;
