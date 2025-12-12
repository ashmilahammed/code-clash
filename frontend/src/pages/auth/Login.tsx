import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";




const Login: React.FC = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ email, password });

      // save user + token in Zustand
      setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      // redirect to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account?{" "}
        <button
          className="link-like"
          onClick={() => navigate("/auth/register")}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
