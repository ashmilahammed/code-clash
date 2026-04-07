import { IUserCoreRepository } from "../../../../domain/repositories/user/IUserCoreRepository";
import { IXpService } from "../../../../domain/services/IXpService";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { SubmissionModel } from "../../../../infrastructure/database/models/submission/SubmissionModel";

export class GetDashboardUseCase {
    constructor(
        private readonly _userRepo: IUserCoreRepository,
        private readonly _xpService: IXpService,
        private readonly _levelRepo: ILevelRepository
    ) { }

    async execute(userId: string) {

        const user = await this._userRepo.findById(userId);

        if (!user) throw new Error("USER_NOT_FOUND");


        //
        const xp = user.getXp();
        const streak = user.getStreaks();

        const levelInfo = await this._levelRepo.findByXp(xp);

        // Build streak dates
        const streakDates = this.buildStreakDates(
            streak.current,
            streak.lastLoginDate
        );

        // Fetch most attempted challenge (Last 30 days)
        const now = new Date();
        const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const mostAttemptedChallengeResult = await SubmissionModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
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
        ]);

        let mostAttemptedChallenge = null;
        if (mostAttemptedChallengeResult.length > 0) {
            const challengeObj = mostAttemptedChallengeResult[0];
            const successfulSubmissions = await SubmissionModel.countDocuments({
                challengeId: challengeObj._id,
                finalStatus: "PASSED",
                createdAt: { $gte: startDate }
            });
            
            let completionRate = Math.round((successfulSubmissions / challengeObj.count) * 100) || 0;
            if (completionRate > 100) completionRate = 100;

            mostAttemptedChallenge = {
                id: challengeObj.challenge._id, 
                title: challengeObj.challenge.title,
                difficulty: challengeObj.challenge.difficulty,
                attempts: challengeObj.count,
                completionRate: completionRate,
                timeLimitMinutes: challengeObj.challenge.timeLimitMinutes,
                description: challengeObj.challenge.description
            };
        }

        return {
            user: user.snapshot(),

            level: {
                level: levelInfo ? levelInfo.levelNumber : 1,
                currentXp: xp,
                minXp: levelInfo ? levelInfo.minXp : 0,
                maxXp: levelInfo ? levelInfo.maxXp : 1000,
                nextLevelXp: levelInfo ? levelInfo.maxXp + 1 : 1000,
            },

            streak: {
                current: streak.current,
                longest: streak.longest,
                dates: streakDates,
            },

            mostAttemptedChallenge,
        };

    }


    // PURE helper 
    private buildStreakDates(
        currentStreak: number,
        lastLoginDate?: Date | null
    ): string[] {
        if (!lastLoginDate || currentStreak <= 0) return [];

        const dates: string[] = [];
        const base = new Date(lastLoginDate);

        // normalize to UTC start of day
        base.setUTCHours(0, 0, 0, 0);

        for (let i = 0; i < currentStreak; i++) {
            const d = new Date(base);
            d.setUTCDate(base.getUTCDate() - i);
            dates.push(d.toISOString().split("T")[0]!);
        }

        return dates.reverse(); // oldest → newest
    }
}





