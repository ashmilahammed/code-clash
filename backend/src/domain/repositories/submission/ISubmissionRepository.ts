import { Submission } from "../../entities/submission/Submission";

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

  getUserStats(userId: string): Promise<any>;

  getRecentActivity(userId: string, limit: number): Promise<any[]>;

  getLeaderboardByTimeframe(
    page: number,
    limit: number,
    timeframe: "weekly" | "monthly",
    search: string
  ): Promise<{ data: any[]; total: number }>;
}
