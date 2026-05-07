import { UserModel } from "../../database/models/user/UserModel";
import { ChallengeModel } from "../../database/models/challenge/ChallengeModel";
import { ConversationModel } from "../../database/models/chat/ConversationModel";
import { ReportModel } from "../../database/models/chat/ReportModel";
import { TransactionModel } from "../../database/models/transactions/TransactionModel";
import { SubmissionModel } from "../../database/models/submission/SubmissionModel";
import { IAdminDashboardRepository, MostAttemptedChallenge, RecentActivity } from "../../../domain/repositories/admin-Dashboard/IAdminDashboardRepository";



export class AdminDashboardRepository implements IAdminDashboardRepository {

    async countUsers() {
        return UserModel.countDocuments({ role: "user" });
    }

    async countPremiumUsers() {
        return UserModel.countDocuments({ role: "user", is_premium: true });
    }

    async countChallenges() {
        return ChallengeModel.countDocuments({});
    }

    async countGroups() {
        return ConversationModel.countDocuments({ type: "group" });
    }

    async countPendingReports() {
        return ReportModel.countDocuments({ status: "pending" });
    }

    async getTotalRevenue(from: Date) {
        const result = await TransactionModel.aggregate([
            { $match: { status: "Completed", date: { $gte: from } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        return result[0]?.total || 0;
    }

    async getSignupsPerDay(from: Date) {
        const now = new Date();
        const data = await UserModel.aggregate([
            { $match: { role: "user", createdAt: { $gte: from } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const map = new Map(data.map((d: { _id: string; count: number }) => [d._id, d.count]));
        const result: { date: string; count: number }[] = [];  // explicit type
        const current = new Date(from);
        while (current <= now) {
            const dateStr = current.toISOString().split("T")[0] ?? "";  // fallback
            result.push({ date: dateStr, count: map.get(dateStr) ?? 0 });
            current.setDate(current.getDate() + 1);
        }
        return result;
    }


    async getMostAttemptedChallenge(from: Date): Promise<MostAttemptedChallenge | null> {
        const result = await SubmissionModel.aggregate([
            { $match: { createdAt: { $gte: from } } },
            { $group: { _id: "$challengeId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
            { $lookup: { from: "challenges", localField: "_id", foreignField: "_id", as: "challenge" } },
            { $unwind: "$challenge" }
        ]);

        if (!result.length) return null;

        const challenge = result[0] as { _id: string; count: number; challenge: { title: string; difficulty: string } };
        const successfulSubmissions = await SubmissionModel.countDocuments({
            challengeId: challenge._id,
            finalStatus: "PASSED",
            createdAt: { $gte: from }
        });

        return {
            title: challenge.challenge.title,
            difficulty: challenge.challenge.difficulty,
            attempts: challenge.count,
            completionRate: Math.round((successfulSubmissions / challenge.count) * 100) || 0
        };
    }

    async getRecentActivity(): Promise<RecentActivity[]> {
        const [challenges, users, reports] = await Promise.all([
            ChallengeModel.find().sort({ createdAt: -1 }).limit(3).select("title createdAt"),
            UserModel.find({ role: "user" }).sort({ createdAt: -1 }).limit(3).select("username createdAt"),
            ReportModel.find({ status: "pending" }).sort({ createdAt: -1 }).limit(3).select("_id createdAt")
        ]);

        const activities: RecentActivity[] = [];

        challenges.forEach((c) => activities.push({ type: "challenge", text: `New challenge "${c.title}" created`, time: c.createdAt }));
        users.forEach((u) => activities.push({ type: "user", text: `User ${u.username} joined the platform`, time: u.createdAt }));
        reports.forEach((r) => activities.push({ type: "report", text: `Report #${r._id.toString().slice(-4)} requires review`, time: r.createdAt }));

        return activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 4);
    }
}