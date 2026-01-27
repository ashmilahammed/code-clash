import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";

import { getAuthErrorMessage } from "../../utils/getAuthErrorMessage";



const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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



  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a1a33] via-[#0f2b55] to-[#081426] px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold tracking-wide text-white mb-6">
          Create an account
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Full name"
          />

          {/* Email */}
          <input
            type="email"
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />

          {/* Password */}
          <input
            type="password"
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
          />

          {/* Confirm Password */}
          <input
            type="password"
            className="w-full rounded-lg bg-white/10 border border-white/30 px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 py-2.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/auth/login")}
            className="text-white font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );




};

export default Register;









// return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">

//     <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Create an account
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {error && (
//           <div className="text-red-600 bg-red-100 p-2 rounded text-sm text-center">
//             {error}
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium mb-1">Name</label>
//           <input
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//             value={username}
//             onChange={(e) => setUserName(e.target.value)}
//             placeholder="Your full name"
//           // required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             type="email"
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="you@example.com"
//           // required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Password</label>
//           <input
//             type="password"
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="At least 6 characters"
//           // required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Confirm Password</label>
//           <input
//             type="password"
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             placeholder="Repeat password"
//           // required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           // disabled={loading || !isFormValid}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>

//       <p className="text-center text-sm mt-4">
//         Already have an account?{" "}
//         <button
//           onClick={() => navigate("/auth/login")}
//           className="text-blue-600 hover:underline"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   </div>
// );
















