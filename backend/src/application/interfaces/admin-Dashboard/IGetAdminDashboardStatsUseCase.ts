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
    signupsData: any[];
    mostAttemptedChallenge: any;
    recentActivity: any[];
  }>;
}