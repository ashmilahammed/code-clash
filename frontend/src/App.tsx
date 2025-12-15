import { Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";

import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotVerifyOtp from "./pages/auth/ForgotVerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";


function App() {
  return (
    <Routes>

      {/* Default route */}
      <Route path="/" element={<Login />} />

      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/auth/verify-otp" element={<VerifyOtp />} />


      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/forgot-verify-otp" element={<ForgotVerifyOtp />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />


      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>

  );
}

export default App;




