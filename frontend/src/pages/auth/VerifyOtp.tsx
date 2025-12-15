// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { verifyOtpApi } from "../../api/authApi";


// const VerifyOtp = () => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Read userId from URL: /auth/verify-otp?userId=123
//   const userId = new URLSearchParams(location.search).get("userId");

//   if (!userId) {
//     return <p>Error: Missing userId. Go back and register again.</p>;
//   }

//   const submitOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (otp.trim().length === 0) {
//       setError("OTP cannot be empty");
//       return;
//     }

//     try {
//       setLoading(true);

//       await verifyOtpApi({ userId, otp });

//       // OTP success → go to login
//       navigate("/auth/login", { replace: true });

//     } catch (err: any) {
//       const msg = err?.response?.data?.message || "Invalid OTP. Try again.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={submitOtp}>
//       <h2>Verify OTP</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <input
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         placeholder="Enter OTP"
//       />

//       <button disabled={loading}>
//         {loading ? "Verifying..." : "Verify"}
//       </button>
//     </form>
//   );
// };

// export default VerifyOtp;




import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../../api/authApi";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30); // 30 sec 

  const navigate = useNavigate();
  const location = useLocation();

  // userId from URL: /auth/verify-otp?userId=123
  const userId = new URLSearchParams(location.search).get("userId");

  if (!userId) {
    return <p>Error: Missing userId. Go back and register again.</p>;
  }

  // Timer countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (otp.trim().length === 0) {
      setError("OTP cannot be empty");
      return;
    }

    try {
      setLoading(true);

      await verifyOtpApi({ userId, otp });

      navigate("/auth/login", { replace: true });

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid OTP. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setError(null);
      setSuccess(null);
      setTimer(30); // reset timer

      await resendOtpApi({ userId });

      setSuccess("New OTP has been sent to your email.");

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to resend OTP.";
      setError(msg);
    }
  };

  return (
    <form onSubmit={submitOtp}>
      <h2>Verify OTP</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      <div style={{ marginTop: "10px" }}>
        {timer > 0 ? (
          <p>Resend OTP in {timer}s</p>
        ) : (
          <button type="button" onClick={resendOtp}>
            Resend OTP
          </button>
        )}
      </div>
    </form>
  );
};

export default VerifyOtp;
