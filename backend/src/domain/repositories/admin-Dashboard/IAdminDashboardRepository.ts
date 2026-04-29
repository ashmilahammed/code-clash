export interface SignupDataPoint {
  date: string;
  count: number;
}

export interface MostAttemptedChallenge {
  title: string;
  difficulty: string;
  attempts: number;
  completionRate: number;
}

export interface RecentActivity {
  type: "challenge" | "user" | "report";
  text: string;
  time: Date;
}

export interface IAdminDashboardRepository {
  countUsers(): Promise<number>;
  countPremiumUsers(): Promise<number>;
  countChallenges(): Promise<number>;
  countGroups(): Promise<number>;
  countPendingReports(): Promise<number>;
  getTotalRevenue(from: Date): Promise<number>;
  getSignupsPerDay(from: Date): Promise<{ date: string; count: number }[]>;
  getMostAttemptedChallenge(from: Date): Promise<MostAttemptedChallenge | null>;
  getRecentActivity(): Promise<RecentActivity[]>;
}