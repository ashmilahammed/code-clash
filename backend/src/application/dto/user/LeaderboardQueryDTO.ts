export interface LeaderboardQueryDTO {
  page: number;
  limit: number;
  search?: string;
  timeframe: "all-time" | "weekly" | "monthly";
}