import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyForgotOtpApi } from "../../api/authApi";



const ForgotVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const userId = new URLSearchParams(location.search).get("userId");

  if (!userId) {
    return <p>Error: User ID missing. Go back and try again.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.trim().length === 0) {
      setError("OTP cannot be empty");
      return;
    }

    try {
      setLoading(true);

      await verifyForgotOtpApi({ userId, otp });

      navigate(`/auth/reset-password?userId=${userId}`);

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify OTP</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default ForgotVerifyOtp;
