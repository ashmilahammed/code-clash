import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { loginApi, googleLoginApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";


import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";



const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //
  const params = new URLSearchParams(location.search);
  const blocked = params.get("blocked");



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

      // setCredentials({
      //   user: res.data.user,
      //   accessToken: res.data.accessToken,
      // });
      setCredentials({
        user: res.data.data.user,
        accessToken: res.data.data.accessToken,
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

      // const msg =
      //   err?.response?.data?.message ||
      //   err?.message ||
      //   "Login failed. Check your credentials.";
      // setError(msg);
      setError(getAuthErrorMessage(err));


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

      // setCredentials({
      //   user: res.data.user,
      //   accessToken: res.data.accessToken,
      // });
      setCredentials({
        user: res.data.data.user,
        accessToken: res.data.data.accessToken,
      });

      // navigate("/dashboard", { replace: true });
      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }


    } catch (err: any) {

      // const msg =
      //   err?.response?.data?.message || err?.message || "Google login failed.";
      // setError(msg);
      setError(getAuthErrorMessage(err));

    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold tracking-widest text-white mb-8">
          &lt;CODE-CLASH/&gt;
        </h2>

        {/* Blocked */}
        {blocked && (
          <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg">
            Your account has been blocked by admin.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg">
            {error}
          </div>
        )}

        {/* Google Login */}
        <div className="mb-6">
          <div className="w-full rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition overflow-hidden">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleLogin(credentialResponse.credential);
                }
              }}
              onError={() => setError("Google login failed")}
              width="100%"
              theme="filled_blue"
              size="large"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-white/60 text-sm mb-6">
          <div className="flex-1 h-px bg-white/20" />
          or
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/70 space-y-2">
          <p>
            don&apos;t have an account?{" "}
            <span
              className="text-white font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/auth/register")}
            >
              Create a account
            </span>
          </p>

          <p
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/auth/forgot-password")}
          >
            Forgot password?
          </p>
        </div>
      </div>
    </div>
  );


};

export default Login;













// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//     <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 animate-fadeIn">

//       <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//         Login
//       </h2>

//       {/*  */}
//       {blocked && (
//         <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
//           Your account has been blocked by admin.
//         </div>
//       )}

//       {/*  */}
//       {error && (
//         <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
//           {error}
//         </div>
//       )}


//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Email */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             value={email}
//             placeholder="you@example.com"
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
//           // required
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">
//             Password
//           </label>
//           <input
//             type="password"
//             value={password}
//             placeholder="Your password"
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
//           // required
//           />
//         </div>

//         <p
//           onClick={() => navigate("/auth/forgot-password")}
//           className="text-sm text-blue-600 cursor-pointer hover:underline"
//         >
//           Forgot Password?
//         </p>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:bg-blue-300"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       {/* Divider */}
//       <div className="my-5 flex items-center justify-center text-gray-500">
//         <span className="px-4">OR</span>
//       </div>

//       {/* Google Login */}
//       <div className="flex justify-center">
//         <GoogleLogin
//           onSuccess={(credentialResponse) => {
//             if (credentialResponse.credential) {
//               handleGoogleLogin(credentialResponse.credential);
//             }
//           }}
//           onError={() => setError("Google login failed")}
//         />
//       </div>

//       {/* Register Link */}
//       <p className="text-center mt-6 text-gray-700">
//         Don’t have an account?{" "}
//         <button
//           className="text-blue-600 hover:underline"
//           onClick={() => navigate("/auth/register")}
//         >
//           Register
//         </button>
//       </p>

//     </div>
//   </div>
// );



