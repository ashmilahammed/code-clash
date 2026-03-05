import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";
import { IXpService } from "../../../../domain/services/IXpService";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";

export class GetUserProfileStatsUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _submissionRepo: ISubmissionRepository,
        private readonly _xpService: IXpService,
        private readonly _levelRepo: ILevelRepository
    ) { }

    async execute(userId: string) {
        const user = await this._userRepo.findById(userId);
        if (!user) throw new Error("USER_NOT_FOUND");

        const xp = user.getXp();
        const streak = user.getStreaks();
        const levelInfo = await this._levelRepo.findByXp(xp);

        // Fetch 
        const stats = await this._submissionRepo.getUserStats(userId);
        const recentActivity = await this._submissionRepo.getRecentActivity(userId, 10);

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
                longest: streak.longest
            },
            stats,
            recentActivity
        };
    }
}
