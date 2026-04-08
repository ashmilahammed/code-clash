import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import GuestRoute from "./components/common/GuestRoute";

import LandingPage from "./pages/landing/LandingPage";
import LandingLayout from "./components/layout/LandingLayout";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotVerifyOtp from "./pages/auth/ForgotVerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/dashboard/Dashboard";
import UserLayout from "./components/layout/UserLayout";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Messages from "./pages/chat/Messages";
import UpgradePremium from "./pages/premium/UpgradePremium";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import UserManagement from "./pages/admin/userManagement/UserManagement";
import UserStats from "./pages/admin/userManagement/UserStats";
import ChallengeManagement from "./pages/admin/challenges/ChallengeManagement"

import CreateChallengeWizard from "./pages/admin/challenges/CreateChallenge";
import BasicInfo from "./pages/admin/challenges/CreateChallenge/BasicInfo";
import ChallengeTags from "./pages/admin/challenges/CreateChallenge/tags";
import ChallengeLanguages from "./pages/admin/challenges/CreateChallenge/languages";
import ChallengeTestCases from "./pages/admin/challenges/CreateChallenge/testCases";
import ChallengeHintsAndSchedule from "./pages/admin/challenges/CreateChallenge/HintsAndSchedule";
import CodeTemplates from "./pages/admin/challenges/CreateChallenge/CodeTemplates";

import LevelManagement from "./pages/admin/levels/LevelManagement";
import BadgeManagement from "./pages/admin/badges/BadgeManagement";
import PlanManagement from "./pages/admin/plans/PlanManagement";
import GroupManagement from "./pages/admin/group/GroupManagement";
import ReportManagement from "./pages/admin/reportManagement/ReportManagement";
import NotificationManagement from "./pages/admin/notificationManagement/NotificationManagement";

import SolveChallenge from "./pages/challenges/SolveChallenge";

import { useAuthStore } from "./store/useAuthStore";

import { refreshTokenApi } from "./api/authApi";
import { meApi } from "./api/authApi";

import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";

import { ROUTES } from "./constants/routes";

import "./App.css";
import { Toaster } from "react-hot-toast";




function App() {
  const setCredentials = useAuthStore((s) => s.setCredentials);
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const stopLoading = useAuthStore((s) => s.stopLoading);
  const isLoading = useAuthStore((s) => s.isLoading);

  const user = useAuthStore((s) => s.user);



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


  if (isLoading) return null;





  return (

    <>
      <Toaster position="top-right" />

      <Routes>

        {/* Landing Page */}
        <Route element={<LandingLayout />}>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route
            path={ROUTES.HOME}
            element={
              user ? <Navigate to={ROUTES.USER.DASHBOARD} replace /> : <LandingPage />
            }
          />
        </Route>



        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
          <Route path={ROUTES.AUTH.VERIFY_OTP} element={<VerifyOtp />} />
          <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.AUTH.FORGOT_VERIFY_OTP} element={<ForgotVerifyOtp />} />
          <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>



        {/* User protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path={ROUTES.USER.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.USER.LEADERBOARD} element={<Leaderboard />} />
            {/* <Route path="/challenges/:id" element={<ChallengeDetails />} /> */}

            <Route path={ROUTES.USER.SOLVE_CHALLENGE} element={<SolveChallenge />} />
            <Route path={ROUTES.USER.PROFILE} element={<Profile />} />
            <Route path={ROUTES.USER.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.USER.MESSAGES} element={<Messages />} />
            <Route path={ROUTES.USER.PREMIUM} element={<UpgradePremium />} />

          </Route>
        </Route>



        {/* Admin protected */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.USERS} element={<UserManagement />} />
            <Route path={ROUTES.ADMIN.USER_STATS} element={<UserStats />} />
            <Route path={ROUTES.ADMIN.CHALLENGES} element={<ChallengeManagement />} />

            <Route path={ROUTES.ADMIN.LEVELS} element={<LevelManagement />} />
            <Route path={ROUTES.ADMIN.BADGES} element={<BadgeManagement />} />
            <Route path={ROUTES.ADMIN.PLANS} element={<PlanManagement />} />
            <Route path={ROUTES.ADMIN.GROUPS} element={<GroupManagement />} />
            <Route path={ROUTES.ADMIN.REPORTS} element={<ReportManagement />} />
            <Route path={ROUTES.ADMIN.NOTIFICATIONS} element={<NotificationManagement />} />

            {/* wizard */}
            <Route
              path={ROUTES.ADMIN.CHALLENGES_CREATE} element={<CreateChallengeWizard />}>
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
            <Route path={ROUTES.ADMIN.CHALLENGES_EDIT} element={<CreateChallengeWizard />}>
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
        <Route path={ROUTES.ERRORS.FORBIDDEN} element={<Forbidden />} />
        <Route path={ROUTES.ERRORS.NOT_FOUND} element={<NotFound />} />


      </Routes>

    </>
  );
}

export default App;










