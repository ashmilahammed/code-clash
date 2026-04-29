export interface IGetDashboardUseCase {
  execute(userId: string): Promise<{
    user: any;
    level: {
      level: number;
      currentXp: number;
      minXp: number;
      maxXp: number;
      nextLevelXp: number;
    };
    streak: {
      current: number;
      longest: number;
      dates: string[];
    };
    mostAttemptedChallenge: {
      id: string;
      title: string;
      difficulty: string;
      attempts: number;
      completionRate: number;
      timeLimitMinutes?: number;
      description: string;
    } | null;
  }>;
}
