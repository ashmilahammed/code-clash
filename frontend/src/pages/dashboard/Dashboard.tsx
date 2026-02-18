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
        // updateUser(data.user);
        updateUser({
          xp: data.user.xp,
          level_id: data.user.level_id,
          avatar: data.user.avatar,
          avatarPublicId: data.user.avatarPublicId,
          badge_id: data.user.badge_id,
          current_streak: data.user.current_streak,
          longest_streak: data.user.longest_streak,
          is_premium: data.user.is_premium,
        });


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








