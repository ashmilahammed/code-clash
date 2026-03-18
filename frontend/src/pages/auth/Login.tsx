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
  <div className="min-h-screen flex bg-[#050B18] text-white">

    {/* LEFT SIDE — Branding */}
    <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-linear-to-br from-indigo-900/40 via-purple-900/20 to-cyan-900/20 relative overflow-hidden">

      {/* Glow blobs */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full bottom-0 right-0" />

      <div className="relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">
          &lt;CODE-CLASH /&gt;
        </h1>

        <p className="text-slate-300 text-lg max-w-md leading-relaxed">
          Master algorithms. Earn XP. Compete globally.
          Solve real coding challenges in an immersive platform built for developers.
        </p>
      </div>

      {/* Mock Code Card */}
      <div className="relative z-10 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>

        <pre className="text-sm text-cyan-400">
{`const xp = solveChallenge();
if(xp > 100){
  levelUp();
}`}
        </pre>
      </div>

    </div>

    {/* RIGHT SIDE — Login Card */}
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
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

        {/* Google */}
        <div className="mb-6">
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

        {/* Divider */}
        <div className="flex items-center gap-3 text-slate-500 text-sm mb-6">
          <div className="flex-1 h-px bg-slate-800" />
          or continue with email
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition"
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-indigo-600 to-cyan-500 py-3 rounded-lg font-bold hover:scale-[1.02] transition shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400 space-y-2">
          <p>
            Don’t have an account?{" "}
            <span
              className="text-white cursor-pointer hover:underline"
              onClick={() => navigate("/auth/register")}
            >
              Create Account
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

  </div>
);

};

export default Login;











