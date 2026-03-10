import { UserModel } from "../../../infrastructure/database/models/user/UserModel";
import { ChallengeModel } from "../../../infrastructure/database/models/challenge/ChallengeModel";
import { ConversationModel } from "../../../infrastructure/database/models/chat/ConversationModel";
import { ReportModel } from "../../../infrastructure/database/models/chat/ReportModel";
import { TransactionModel } from "../../../infrastructure/database/models/transactions/TransactionModel";
import { SubmissionModel } from "../../../infrastructure/database/models/submission/SubmissionModel";


export class GetAdminDashboardStatsUseCase {
  async execute() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      premiumUsers,
      totalChallenges,
      totalGroups,
      pendingReports,
      monthlyRevenueResult,
      signupsData,
      mostAttemptedChallengeResult,
      recentActivity
    ] = await Promise.all([
      UserModel.countDocuments({ role: "user" }),
      UserModel.countDocuments({ role: "user", is_premium: true }),
      ChallengeModel.countDocuments({}),
      ConversationModel.countDocuments({ type: "group" }),
      ReportModel.countDocuments({ status: "pending" }),
      
      // Monthly Revenue
      TransactionModel.aggregate([
        { $match: { status: "Completed", date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // Signups for last 30 days
      UserModel.aggregate([
        { $match: { role: "user", createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Most Attempted Challenge
      SubmissionModel.aggregate([
        { $group: { _id: "$challengeId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "challenges",
            localField: "_id",
            foreignField: "_id",
            as: "challenge"
          }
        },
        { $unwind: "$challenge" }
      ]),

      // Recent Activity (Mixed)
      this.getRecentActivity()
    ]);

    // Calculate Completion Rate for Most Attempted Challenge
    let mostAttemptedChallenge = null;
    if (mostAttemptedChallengeResult.length > 0) {
      const challenge = mostAttemptedChallengeResult[0];
      const successfulSubmissions = await SubmissionModel.countDocuments({
        challengeId: challenge._id,
        finalStatus: "PASSED"
      });
      mostAttemptedChallenge = {
        title: challenge.challenge.title,
        difficulty: challenge.challenge.difficulty,
        attempts: challenge.count,
        completionRate: Math.round((successfulSubmissions / challenge.count) * 100) || 0
      };
    }

    return {
      stats: {
        totalUsers,
        premiumUsers,
        totalChallenges,
        totalGroups,
        pendingReports,
        monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
      },
      signupsData: this.formatSignups(signupsData, thirtyDaysAgo, now),
      mostAttemptedChallenge,
      recentActivity
    };
  }

  private formatSignups(data: any[], start: Date, end: Date) {
    const map = new Map(data.map(d => [d._id, d.count]));
    const result = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: map.get(dateStr) || 0
      });
      current.setDate(current.getDate() + 1);
    }
    return result;
  }

  private async getRecentActivity() {
    // Fetch a combined list of recent events
    const [challenges, users, reports] = await Promise.all([
      ChallengeModel.find().sort({ createdAt: -1 }).limit(3).select("title createdAt"),
      UserModel.find({ role: "user" }).sort({ createdAt: -1 }).limit(3).select("username createdAt"),
      ReportModel.find({ status: "pending" }).sort({ createdAt: -1 }).limit(3).select("_id createdAt")
    ]);

    const activities: any[] = [];

    challenges.forEach((c: any) => activities.push({
      type: "challenge",
      text: `New challenge "${c.title}" created`,
      time: c.createdAt
    }));

    users.forEach((u: any) => activities.push({
      type: "user",
      text: `User ${u.username} joined the platform`,
      time: u.createdAt
    }));

    reports.forEach((r: any) => activities.push({
      type: "report",
      text: `Report #${r._id.toString().slice(-4)} requires review`,
      time: r.createdAt
    }));

    return activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 4);
  }
}
