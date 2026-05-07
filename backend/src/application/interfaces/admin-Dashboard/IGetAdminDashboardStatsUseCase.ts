export interface DashboardSignupData {
  date: string;
  count: number;
}

export interface DashboardMostAttemptedChallenge {
  title: string;
  difficulty: string;
  attempts: number;
  completionRate: number;
}

export interface DashboardRecentActivity {
  type: "challenge" | "user" | "report";
  text: string;
  time: Date;
}

export interface IGetAdminDashboardStatsUseCase {
  execute(range?: string): Promise<{
    stats: {
      totalUsers: number;
      premiumUsers: number;
      totalChallenges: number;
      totalGroups: number;
      pendingReports: number;
      revenue: number;
    };
    signupsData: DashboardSignupData[];
    mostAttemptedChallenge: DashboardMostAttemptedChallenge | null;
    recentActivity: DashboardRecentActivity[];
  }>;
}