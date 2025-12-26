import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";



const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await registerApi({ username, email, password });

      const userId = res.data?.userId;
      if (!userId) throw new Error("Failed to register user. Try again.");

      navigate(`/auth/verify-otp?userId=${userId}`);

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 animate-fadeIn px-4">

      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <div className="text-red-600 bg-red-100 p-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;





















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerApi } from "../../api/authApi";



// const Register: React.FC = () => {
//   const navigate = useNavigate();

//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const validate = () => {
//     if (!username.trim() || !email.trim() || !password) {
//       setError("Please fill all fields.");
//       return false;
//     }
//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       setError("Please enter a valid email.");
//       return false;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return false;
//     }
//     if (password !== confirm) {
//       setError("Passwords do not match.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!validate()) return;

//     try {
//       setLoading(true);

//       const res = await registerApi({ username, email, password });

//       // Expected response:
//       // { message: "OTP sent to email", userId: "123" }

//       const userId = res.data?.userId;
//       if (!userId) {
//         throw new Error("Failed to register user. Try again.");
//       }

//       // Redirect to OTP verification page
//       navigate(`/auth/verify-otp?userId=${userId}`);

//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Registration failed. Try again.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <h2>Create an account</h2>

//       <form onSubmit={handleSubmit} className="auth-form">
//         {error && <div className="auth-error">{error}</div>}

//         <label>
//           <span>Name</span>
//           <input
//             name="username"
//             value={username}
//             onChange={(e) => setUserName(e.target.value)}
//             required
//             placeholder="Your full name"
//           />
//         </label>

//         <label>
//           <span>Email</span>
//           <input
//             name="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             placeholder="you@example.com"
//           />
//         </label>

//         <label>
//           <span>Password</span>
//           <input
//             name="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             placeholder="At least 6 characters"
//           />
//         </label>

//         <label>
//           <span>Confirm Password</span>
//           <input
//             name="confirm"
//             type="password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             required
//             placeholder="Repeat password"
//           />
//         </label>

//         <button type="submit" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>

//       <p className="auth-footer">
//         Already have an account?{" "}
//         <button
//           className="link-like"
//           onClick={() => navigate("/auth/login")}
//           style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Register;
