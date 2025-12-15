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

      // server returns userId
      const userId = res.data.userId;

      navigate(`/auth/forgot-verify-otp?userId=${userId}`);

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
};

export default ForgotPassword;
