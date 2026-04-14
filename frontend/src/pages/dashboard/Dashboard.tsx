import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { getDashboardData } from "../../api/userApi";

import LevelProgress from "./LevelProgress";
import StreakCalendar from "./StreakCalendar";
import ChallengeList from "./ChallengeList";
import PremiumBanner from "./PremiumBanner";
import ActiveGroups from "./ActiveGroups";
import MostAttemptedChallengeCard from "./MostAttemptedChallengeCard";
import { WelcomeModal } from "../../components/modals/WelcomeModal";

//  Types for dashboard response
type DashboardData = {
  level: {
    level: number;
    currentXp: number;
    minXp: number;
    maxXp: number;
  };
  streak: {
    current: number;
    longest: number;
    dates: string[];
  };
  mostAttemptedChallenge?: {
    id: string;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    attempts: number;
    completionRate: number;
    timeLimitMinutes?: number;
    isPremium?: boolean;
  } | null;
};

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    getDashboardData()
      .then((data) => {
        // auth-related → zustand
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
          mostAttemptedChallenge: data.mostAttemptedChallenge,
        });
      })
      .catch((err) => {
        console.error("Failed to load dashboard", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [updateUser]);

  // Handle welcome bonus claim
  const handleWelcomeClaim = () => {
    fetchDashboardData();
  };


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
    <div className="min-h-screen bg-[#0B1220] px-6 py-6 space-y-8 relative">
      <WelcomeModal onClaim={handleWelcomeClaim} />
      {/* Level / XP */}
      <LevelProgress
        level={dashboard.level.level}
        currentXp={dashboard.level.currentXp}
        minXp={dashboard.level.minXp}
        maxXp={dashboard.level.maxXp}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Attempted Challenge */}
        <div className="lg:col-span-2">
          {dashboard.mostAttemptedChallenge ? (
            <MostAttemptedChallengeCard
              challenge={dashboard.mostAttemptedChallenge}
              userPremium={user.is_premium}
            />
          ) : (
            <div className="bg-[#020617] rounded-xl flex items-center justify-center p-6 h-full border border-slate-800">
              <p className="text-slate-400">No challenges attempted recently.</p>
            </div>
          )}
        </div>

        {/* Streak */}
        <StreakCalendar
          currentStreak={dashboard.streak.current}
          longestStreak={dashboard.streak.longest}
          activeDates={dashboard.streak.dates}
        />
      </div>

      {/* Challenges Section */}
      <div className="space-y-6 mt-10">
        <ChallengeList />
      </div>

      {/* Premium */}
      {!user.is_premium && <PremiumBanner />}

      {/* Groups */}
      <ActiveGroups />
    </div>
  );
};

export default Dashboard;








