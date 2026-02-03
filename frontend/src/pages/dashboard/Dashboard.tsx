import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { getDashboardData } from "../../api/userApi";

import LevelProgress from "./LevelProgress";
import StreakCalendar from "./StreakCalendar";
import ChallengeList from "./ChallengeList";
import PremiumBanner from "./PremiumBanner";
import ActiveGroups from "./ActiveGroups";


 //  Types for dashboard response
type DashboardData = {
  level: {
    level: number;
    currentXp: number;
    nextLevelXp: number;
  };
  streak: {
    current: number;
    longest: number;
    dates: string[];
  };
};

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getDashboardData()
      .then((data) => {
        if (!mounted) return;

        // auth-related → zustand
        updateUser(data.user);

        // dashboard-specific → local state
        setDashboard({
          level: data.level,
          streak: data.streak,
        });
      })
      .catch((err) => {
        console.error("Failed to load dashboard", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [updateUser]);


//   Loading / Guard
  if (loading || !user || !dashboard) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">
          Loading dashboard…
        </p>
      </div>
    );
  }

  

  
  return (
    <div className="min-h-screen bg-[#0B1220] px-6 py-6 space-y-8">
      {/* Level / XP */}
      <LevelProgress
        level={dashboard.level.level}
        currentXp={dashboard.level.currentXp}
        nextLevelXp={dashboard.level.nextLevelXp}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenges */}
        <div className="lg:col-span-2 space-y-6">
          <ChallengeList />
        </div>

        {/* Streak */}
        <StreakCalendar
          currentStreak={dashboard.streak.current}
          longestStreak={dashboard.streak.longest}
          activeDates={dashboard.streak.dates}
        />
      </div>

      {/* Premium */}
      {!user.is_premium && <PremiumBanner />}

      {/* Groups */}
      <ActiveGroups />
    </div>
  );
};

export default Dashboard;










// import { useAuthStore } from "../../store/useAuthStore";
// import { logoutApi } from "../../api/authApi";
// import { useNavigate } from "react-router-dom";
// import { User } from "lucide-react";



// const Dashboard = () => {
//   const user = useAuthStore((s) => s.user);
//   const logoutUser = useAuthStore((s) => s.logoutUser);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logoutApi();
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }

//     logoutUser();
//     navigate("/auth/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 animate-fadeIn">
//       <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

//         {/* Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="bg-blue-600 text-white p-3 rounded-full">
//             <User size={28} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold">Welcome, {user?.username}</h2>
//             <p className="text-gray-600 text-sm">Glad to have you back!</p>
//           </div>
//         </div>

//         {/* Info Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//           <div className="p-4 border rounded-lg bg-gray-50">
//             <p className="text-gray-500 text-sm">Email</p>
//             <p className="font-medium">{user?.email}</p>
//           </div>

//           <div className="p-4 border rounded-lg bg-gray-50">
//             <p className="text-gray-500 text-sm">Role</p>
//             <p className="font-medium capitalize">{user?.role}</p>
//           </div>

//           {/* <div className="p-4 border rounded-lg bg-gray-50">
//             <p className="text-gray-500 text-sm">XP</p>
//             <p className="font-medium">{user?.xp ?? 0}</p>
//           </div>

//           <div className="p-4 border rounded-lg bg-gray-50">
//             <p className="text-gray-500 text-sm">Level</p>
//             <p className="font-medium">{user?.level_id ?? "—"}</p>
//           </div>

//           <div className="p-4 border rounded-lg bg-gray-50">
//             <p className="text-gray-500 text-sm">Current Streak</p>
//             <p className="font-medium">{user?.current_streak ?? 0} days</p>
//           </div>

//           <div className="p-4 border rounded-lg bg-gray-50">
//             <p className="text-gray-500 text-sm">Longest Streak</p>
//             <p className="font-medium">{user?.longest_streak ?? 0} days</p>
//           </div> */}
//         </div>

//         {/* Logout Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition shadow-md"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


