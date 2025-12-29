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


  // Email/password login
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

      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err: any) {
      if (err?.response?.data?.needsVerification) {
        const userId = err.response.data.userId;
        navigate(`/auth/verify-otp?userId=${userId}&email=${encodeURIComponent(email)}`);
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


  // Google login
  const handleGoogleLogin = async (credential: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await googleLoginApi({ googleToken: credential });

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
      const msg =
        err?.response?.data?.message || err?.message || "Google login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          <p
            onClick={() => navigate("/auth/forgot-password")}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center justify-center text-gray-500">
          <span className="px-4">OR</span>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleLogin(credentialResponse.credential);
              }
            }}
            onError={() => setError("Google login failed")}
          />
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-700">
          Don’t have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/auth/register")}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;

















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";

// import { loginApi, googleLoginApi } from "../../api/authApi";
// import { useAuthStore } from "../../store/useAuthStore";



// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const setCredentials = useAuthStore((s) => s.setCredentials);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);


//   // email, password login
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

//       // navigate("/dashboard", { replace: true });
//       if (res.data.user.role === "admin") {
//         navigate("/admin", { replace: true });
//       } else {
//         navigate("/dashboard", { replace: true });
//       }



//     } catch (err: any) {
//       // OTP verification flow
//       if (err?.response?.data?.needsVerification) {
//         const userId = err.response.data.userId;
//         navigate(
//           `/auth/verify-otp?userId=${userId}&email=${encodeURIComponent(email)}`
//         );
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


//   // google login
//   const handleGoogleLogin = async (credential: string) => {
//     try {
//       setLoading(true);
//       setError(null);


//       const res = await googleLoginApi({
//         googleToken: credential,
//       });

//       setCredentials({
//         user: res.data.user,
//         accessToken: res.data.accessToken,
//       });

//       navigate("/dashboard", { replace: true });
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Google login failed.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };




//   //
//   return (
//     <div className="auth-page">
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit} className="auth-form">
//         {error && <div className="auth-error">{error}</div>}

//         <label>
//           <span>Email</span>
//           <input
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
//             type="password"
//             value={password}
//             placeholder="Your password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>

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

//       {/* Divider */}
//       <div style={{ margin: "20px 0", textAlign: "center" }}>OR</div>

//       {/* Google Sign In */}
//       <div style={{ display: "flex", justifyContent: "center" }}>
//         <GoogleLogin
//           onSuccess={(credentialResponse) => {
//             if (credentialResponse.credential) {
//               handleGoogleLogin(credentialResponse.credential);
//             }
//           }}
//           onError={() => setError("Google login failed")}
//         />
//       </div>

//       <p className="auth-footer" style={{ marginTop: "20px" }}>
//         Don&apos;t have an account?{" "}
//         <button
//           className="link-like"
//           onClick={() => navigate("/auth/register")}
//           style={{
//             background: "none",
//             border: "none",
//             color: "blue",
//             cursor: "pointer",
//           }}
//         >
//           Register
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Login;

















