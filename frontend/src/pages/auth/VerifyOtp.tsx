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

  // userId from URL: /auth/verify-otp?userId=123&email=user@example.com&otp=654321
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const email = params.get("email");
  const otpFromLogin = params.get("otp"); // NEW

  if (!userId) {
    return (
      <div className="auth-page">
        <h2>Verify OTP</h2>
        <p style={{ color: "red" }}>Error: Missing userId. Go back and register again.</p>
        <button onClick={() => navigate("/auth/register")}>Go to Register</button>
      </div>
    );
  }

  // NEW: Console log OTP if coming from login redirect
  useEffect(() => {
    if (otpFromLogin) {
      console.log("OTP from login redirect =", otpFromLogin);
    }
  }, [otpFromLogin]);

  // NEW: Auto-fill OTP field (optional, for development)
  useEffect(() => {
    if (otpFromLogin) {
      setOtp(otpFromLogin);
    }
  }, [otpFromLogin]);

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
    <div className="auth-page">
      <h2>Verify OTP</h2>

      {email && (
        <p style={{ marginBottom: "10px", color: "#666" }}>
          Please verify your account for <strong>{email}</strong>
        </p>
      )}

      <p style={{ marginBottom: "20px", fontSize: "14px" }}>
        An OTP has been sent to your email. Please enter it below to verify your account.
      </p>

      <form onSubmit={submitOtp}>
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

        <div style={{ marginTop: "15px" }}>
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
