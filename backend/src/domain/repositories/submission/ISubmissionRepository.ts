import { Submission } from "../../entities/submission/Submission";

export interface IUserSubmissionStats {
  stats: {
    totalSubmissions: number;
    passedSubmissions: number;
    acceptanceRate: number;
  };
  byDifficulty: { difficulty: string; count: number }[];
  byLanguage: { language: string; count: number }[];
}

export interface IRecentActivity {
  _id: string;
  challengeName: string;
  status: string;
  submittedAt: Date;
}

export interface ILeaderboardEntry {
  id: string;
  username: string;
  avatar_url?: string;
  badge?: {
    name: string;
    icon_url: string;
  };
  xp: number;
  challengesSolved: number;
  [key: string]: unknown; // Allow other user properties
}

export interface ISubmissionRepository {

  create(submission: Submission): Promise<Submission>;

  findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<Submission[]>;

  hasUserSolvedChallenge(
    userId: string,
    challengeId: string
  ): Promise<boolean>;

  countSolved(userId: string): Promise<number>;

  getUserStats(userId: string): Promise<IUserSubmissionStats>;

  getRecentActivity(userId: string, limit: number): Promise<IRecentActivity[]>;

  getLeaderboardByTimeframe(
    page: number,
    limit: number,
    timeframe: "weekly" | "monthly" | "all-time",
    search: string
  ): Promise<{ data: ILeaderboardEntry[]; total: number }>;
}
