import { ILeaderboardEntry } from "../../../../domain/repositories/submission/ISubmissionRepository";

export interface IGetLeaderboardUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    timeframe: "all-time" | "weekly" | "monthly"
  ): Promise<{ data: ILeaderboardEntry[]; total: number }>;
}
