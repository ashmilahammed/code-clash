import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotVerifyOtp from "./pages/auth/ForgotVerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import GuestRoute from "./components/common/GuestRoute";

import Dashboard from "./pages/dashboard/Dashboard";
import UserLayout from "./components/layout/UserLayout";
import Badges from "./pages/profile/Badges";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ChallengeManagement from "./pages/admin/ChallengeManagement"
import ChallengeDetails from "./pages/dashboard/ChallengeDetails";

import { useAuthStore } from "./store/useAuthStore";

import { refreshTokenApi } from "./api/authApi";
import { meApi } from "./api/authApi";


import "./App.css";



function App() {
  const setCredentials = useAuthStore((s) => s.setCredentials);
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const stopLoading = useAuthStore((s) => s.stopLoading);
  const isLoading = useAuthStore((s) => s.isLoading);



  useEffect(() => {
    const restoreSession = async () => {
      try {
        // refresh session 
        const refreshRes = await refreshTokenApi();
        const newAccessToken = refreshRes.data.data.accessToken;

        // store token
        useAuthStore.getState().updateAccessToken(newAccessToken);

        // call /me
        const meRes = await meApi();

        //  set full credentials
        setCredentials({
          //user: meRes.data.data.user,
          user: meRes.data.data.user,
          accessToken: newAccessToken,
        });
      } catch {
        logoutUser();
      } finally {
        stopLoading();
      }
    };

    restoreSession();
  }, []);


  // useEffect(() => {
  //   // auth state is restored lazily via axios interceptor
  //   stopLoading();
  // }, []);

  if (isLoading) return null;



  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />


      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/forgot-verify-otp" element={<ForgotVerifyOtp />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>



      {/* User protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges/:id" element={<ChallengeDetails />} />
          <Route path="/badges" element={<Badges />} />
        </Route>
      </Route>


      {/* Admin protected */}
      {/* <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route> */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/challenges" element={<ChallengeManagement />} />
        </Route>
      </Route>




      {/* Errors */}
      {/* <Route path="/403" element={<Forbidden />} /> */}

    </Routes>
  );
}

export default App;











// import { Routes, Route } from "react-router-dom";
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";
// import VerifyOtp from "./pages/auth/VerifyOtp";
// import ProtectedRoute from "./components/common/ProtectedRoute";

// import Dashboard from "./pages/dashboard/Dashboard";

// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ForgotVerifyOtp from "./pages/auth/ForgotVerifyOtp";
// import ResetPassword from "./pages/auth/ResetPassword";

// import AdminRoute from "./components/common/AdminRoute";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// import "./App.css"



// function App() {
//   return (
//     <Routes>

//       {/* Default route */}
//       <Route path="/" element={<Login />} />

//       {/* Auth routes */}
//       <Route path="/auth/login" element={<Login />} />
//       <Route path="/auth/register" element={<Register />} />

//       <Route path="/auth/verify-otp" element={<VerifyOtp />} />


//       <Route path="/auth/forgot-password" element={<ForgotPassword />} />
//       <Route path="/auth/forgot-verify-otp" element={<ForgotVerifyOtp />} />
//       <Route path="/auth/reset-password" element={<ResetPassword />} />


//       {/*user Protected Route */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin protected route */}
//       <Route
//         path="/admin"
//         element={
//           <AdminRoute>
//             <AdminDashboard />
//           </AdminRoute>
//         }
//       />

//     </Routes>

//   );
// }

// export default App;




