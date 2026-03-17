import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerApi } from "../../api/authApi";

import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";


const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  //
  const validate = () => {

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill all fields.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   setError(
    //     "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number."
    //   );
    //   return false;
    // }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return false;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return false;
    }


    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };


  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await registerApi({ username, email, password });

      // const userId = res.data?.userId;
      const userId = res.data?.data?.userId;
      if (!userId) throw new Error("Failed to register user. Try again.");

      navigate(`/auth/verify-otp?userId=${userId}`);

    } catch (err: any) {

      // setError(
      //   err?.response?.data?.message ||
      //   err?.message ||
      //   "Registration failed. Try again."
      // );
      setError(getAuthErrorMessage(err));

    } finally {
      setLoading(false);
    }
  };

  //
  // const isFormValid =
  //   username.trim() &&
  //   email.trim() &&
  //   password.length >= 6 &&
  //   password === confirm;



  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] px-4">
  //     {/* Glass Card */}
  //     <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

  //       {/* Title */}
  //       <h2 className="text-center text-2xl font-semibold tracking-wide text-white mb-6">
  //         Create an account
  //       </h2>

  //       {/* Error */}
  //       {error && (
  //         <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
  //           {error}
  //         </div>
  //       )}

  //       {/* Form */}
  //       <form onSubmit={handleSubmit} className="space-y-4">

  //         {/* Name */}
  //         <input
  //           className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  //           value={username}
  //           onChange={(e) => setUserName(e.target.value)}
  //           placeholder="Full name"
  //         />

  //         {/* Email */}
  //         <input
  //           type="email"
  //           className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           placeholder="E-mail"
  //         />

  //         {/* Password */}
  //         <div className="relative">
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             placeholder="Password "
  //           />
  //           <button
  //             type="button"
  //             className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
  //             onClick={() => setShowPassword(!showPassword)}
  //           >
  //             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  //           </button>
  //         </div>

  //         {/* Confirm Password */}
  //         <div className="relative">
  //           <input
  //             type={showConfirm ? "text" : "password"}
  //             className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
  //             value={confirm}
  //             onChange={(e) => setConfirm(e.target.value)}
  //             placeholder="Confirm password"
  //           />
  //           <button
  //             type="button"
  //             className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
  //             onClick={() => setShowConfirm(!showConfirm)}
  //           >
  //             {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
  //           </button>
  //         </div>

  //         {/* Submit */}
  //         <button
  //           type="submit"
  //           disabled={loading}
  //           className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
  //         >
  //           {loading ? "Registering..." : "Register"}
  //         </button>
  //       </form>

  //       {/* Footer */}
  //       <p className="text-center text-sm text-white/70 mt-6">
  //         Already have an account?{" "}
  //         <span
  //           onClick={() => navigate("/auth/login")}
  //           className="text-white font-medium cursor-pointer hover:underline"
  //         >
  //           Login
  //         </span>
  //       </p>
  //     </div>
  //   </div>
  // );


  return (
    <div className="min-h-screen flex bg-[#050B18] text-white">

      {/* LEFT BRANDING SIDE */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-linear-to-br from-indigo-900/40 via-purple-900/20 to-cyan-900/20 relative overflow-hidden">

        {/* Glow */}
        <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full -top-20 -left-20" />
        <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full bottom-0 right-0" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-6">
            &lt;CODE-CLASH /&gt;
          </h1>

          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Join thousands of coders solving real algorithmic challenges,
            earning XP, unlocking badges, and competing globally.
          </p>
        </div>

        {/* Mock Challenge Card */}
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

      {/* RIGHT FORM SIDE */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8">

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Your Account
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500 transition"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500 transition"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-cyan-500 py-3 rounded-lg font-bold hover:scale-[1.02] transition shadow-lg"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/auth/login")}
              className="text-white cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>

    </div>
  );

};

export default Register;