import { IAdminDashboardRepository } from "../../../domain/repositories/admin-Dashboard/IAdminDashboardRepository";
import { IGetAdminDashboardStatsUseCase } from "../../interfaces/admin-Dashboard/IGetAdminDashboardStatsUseCase";


export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(
    private readonly _adminDashboardRepo: IAdminDashboardRepository  
  ) { }

  async execute(range: string = "30days") {
    const startDate = this.resolveStartDate(range);

    const [
      totalUsers,
      premiumUsers,
      totalChallenges,
      totalGroups,
      pendingReports,
      revenue,
      signupsData,
      mostAttemptedChallenge,
      recentActivity
    ] = await Promise.all([
      this._adminDashboardRepo.countUsers(),
      this._adminDashboardRepo.countPremiumUsers(),
      this._adminDashboardRepo.countChallenges(),
      this._adminDashboardRepo.countGroups(),
      this._adminDashboardRepo.countPendingReports(),
      this._adminDashboardRepo.getTotalRevenue(startDate),
      this._adminDashboardRepo.getSignupsPerDay(startDate),
      this._adminDashboardRepo.getMostAttemptedChallenge(startDate),
      this._adminDashboardRepo.getRecentActivity()
    ]);

    return {
      stats: { totalUsers, premiumUsers, totalChallenges, totalGroups, pendingReports, revenue },
      signupsData,
      mostAttemptedChallenge,
      recentActivity
    };
  }

  private resolveStartDate(range: string): Date {
    const now = new Date();
    switch (range) {
      case "7days": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "3months": return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case "all": return new Date(2024, 0, 1);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}









