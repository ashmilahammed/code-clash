export interface IGetLeaderboardUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    timeframe: "all-time" | "weekly" | "monthly"
  ): Promise<{ data: any[]; total: number }>;
}
