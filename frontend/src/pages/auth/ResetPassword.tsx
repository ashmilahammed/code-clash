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
    return <p>Error: Missing user ID.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirm) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({ userId, password });

      alert("Password reset successful! Please login.");
      navigate("/auth/login");

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? "Saving..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
