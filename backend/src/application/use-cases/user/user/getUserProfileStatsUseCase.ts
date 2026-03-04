import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";
import { IXpService } from "../../../../domain/services/IXpService";

export class GetUserProfileStatsUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _submissionRepo: ISubmissionRepository,
        private readonly _xpService: IXpService
    ) { }

    async execute(userId: string) {
        const user = await this._userRepo.findById(userId);
        if (!user) throw new Error("USER_NOT_FOUND");

        const xp = user.getXp();
        const streak = user.getStreaks();
        const levelInfo = this._xpService.getLevelInfo(xp);

        // Fetch aggregation metrics
        const stats = await this._submissionRepo.getUserStats(userId);
        const recentActivity = await this._submissionRepo.getRecentActivity(userId, 10);

        return {
            user: user.snapshot(),
            level: {
                level: levelInfo.level,
                currentXp: xp,
                nextLevelXp: levelInfo.nextLevelXp,
            },
            streak: {
                current: streak.current,
                longest: streak.longest
            },
            stats,
            recentActivity
        };
    }
}
