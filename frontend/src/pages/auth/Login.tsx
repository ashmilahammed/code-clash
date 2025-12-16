import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { loginApi, googleLoginApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";



const Login: React.FC = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // email, password login
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

      setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      // navigate("/dashboard", { replace: true });
      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }



    } catch (err: any) {
      // OTP verification flow
      if (err?.response?.data?.needsVerification) {
        const userId = err.response.data.userId;
        navigate(
          `/auth/verify-otp?userId=${userId}&email=${encodeURIComponent(email)}`
        );
        return;
      }

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  // google login
  const handleGoogleLogin = async (credential: string) => {
    try {
      setLoading(true);
      setError(null);


      const res = await googleLoginApi({
        googleToken: credential,
      });

      setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Google login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };




  //
  return (
    <div className="auth-page">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <label>
          <span>Email</span>
          <input
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
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <p
          onClick={() => navigate("/auth/forgot-password")}
          style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
        >
          Forgot Password?
        </p>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ margin: "20px 0", textAlign: "center" }}>OR</div>

      {/* Google Sign In */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              handleGoogleLogin(credentialResponse.credential);
            }
          }}
          onError={() => setError("Google login failed")}
        />
      </div>

      <p className="auth-footer" style={{ marginTop: "20px" }}>
        Don&apos;t have an account?{" "}
        <button
          className="link-like"
          onClick={() => navigate("/auth/register")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;


















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginApi } from "../../api/authApi";
// import { useAuthStore } from "../../store/useAuthStore";



// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const setCredentials = useAuthStore((s) => s.setCredentials);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!email || !password) {
//       setError("Please enter email and password.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await loginApi({ email, password });

//       setCredentials({
//         user: res.data.user,
//         accessToken: res.data.accessToken,
//       });

//       navigate("/dashboard", { replace: true });

//     } catch (err: any) {
//       // Check if this is an unverified user error
//       // if (err?.response?.data?.requiresVerification) {
//       if (err?.response?.data?.needsVerification) {
//         const userId = err.response.data.userId;
//         // Redirect to OTP verification page with userId and email
//         navigate(`/auth/verify-otp?userId=${userId}&email=${encodeURIComponent(email)}`);
//         return;
//       }

//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Login failed. Check your credentials.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit} className="auth-form">
//         {error && <div className="auth-error">{error}</div>}

//         <label>
//           <span>Email</span>
//           <input
//             name="email"
//             type="email"
//             value={email}
//             placeholder="you@example.com"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           <span>Password</span>
//           <input
//             name="password"
//             type="password"
//             value={password}
//             placeholder="Your password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>

//         {/* Forgot Password Link */}
//         <p
//           onClick={() => navigate("/auth/forgot-password")}
//           style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
//         >
//           Forgot Password?
//         </p>

//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       <p className="auth-footer">
//         Don't have an account?{" "}
//         <button
//           className="link-like"
//           onClick={() => navigate("/auth/register")}
//           style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
//         >
//           Register
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Login;
