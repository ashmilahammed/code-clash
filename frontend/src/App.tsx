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
// import Badges from "./pages/profile/Badges";
import Profile from "./pages/profile/Profile";
import Leaderboard from "./pages/dashboard/Leaderboard";
// import Leaderboard from "./pages/dashboard/Leaderboard";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/userManagement/UserManagement";

import ChallengeManagement from "./pages/admin/challenges/ChallengeManagement"
// import ChallengeDetails from "./pages/dashboard/ChallengeDetails";

import CreateChallengeWizard from "./pages/admin/challenges/CreateChallenge";
import BasicInfo from "./pages/admin/challenges/CreateChallenge/BasicInfo";
import ChallengeTags from "./pages/admin/challenges/CreateChallenge/tags";
import ChallengeLanguages from "./pages/admin/challenges/CreateChallenge/languages";
import ChallengeTestCases from "./pages/admin/challenges/CreateChallenge/testCases";
import ChallengeHintsAndSchedule from "./pages/admin/challenges/CreateChallenge/HintsAndSchedule";
import CodeTemplates from "./pages/admin/challenges/CreateChallenge/CodeTemplates";

import LevelManagement from "./pages/admin/levels/LevelManagement";

import SolveChallenge from "./pages/challenges/SolveChallenge";


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
          <Route path="/badges" element={<Leaderboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {/* <Route path="/challenges/:id" element={<ChallengeDetails />} /> */}

          <Route path="/challenges/:id" element={<SolveChallenge />} />
          <Route path="/profile" element={<Profile />} />

        </Route>
      </Route>



      {/* Admin protected */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/challenges" element={<ChallengeManagement />} />

          <Route path="/admin/levels" element={<LevelManagement />} />

          {/* wizard */}
          <Route
            path="/admin/challenges/create" element={<CreateChallengeWizard />}>
            {/* Step 1 */}
            <Route index element={<BasicInfo />} />

            {/* Step 2 (need challengeId) */}
            <Route path=":id/tags" element={<ChallengeTags />} />
            <Route path=":id/languages" element={<ChallengeLanguages />} />
            <Route path=":id/test-cases" element={<ChallengeTestCases />} />
            <Route path=":id/hints" element={<ChallengeHintsAndSchedule />} />
            <Route path=":id/templates" element={<CodeTemplates />} />
          </Route>

          {/* Edit / Resume Draft Routes */}
          <Route path="/admin/challenges/edit/:id" element={<CreateChallengeWizard />}>
            <Route index element={<BasicInfo />} />
            <Route path="tags" element={<ChallengeTags />} />
            <Route path="languages" element={<ChallengeLanguages />} />
            <Route path="test-cases" element={<ChallengeTestCases />} />
            <Route path="hints" element={<ChallengeHintsAndSchedule />} />
            <Route path="templates" element={<CodeTemplates />} />
          </Route>
        </Route>
      </Route>





      {/* Errors */}
      {/* <Route path="/403" element={<Forbidden />} /> */}

    </Routes>
  );
}

export default App;










