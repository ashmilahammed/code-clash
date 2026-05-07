import { IUserCoreRepository } from "../../../../domain/repositories/user/IUserCoreRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";
import { IXpService } from "../../../../domain/services/IXpService";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { IBadgeRepository } from "../../../../domain/repositories/badge/IBadgeRepository";
import { UserDTOMapper } from "../../../mappers/UserDTOMapper";import { IGetUserProfileStatsUseCase } from "../../../interfaces/user/user/IGetUserProfileStatsUseCase";

import { Badge } from "../../../../domain/entities/badge/Badge";

export class GetUserProfileStatsUseCase implements IGetUserProfileStatsUseCase {
    constructor(
        private readonly _userRepo: IUserCoreRepository,
        private readonly _submissionRepo: ISubmissionRepository,
        private readonly _xpService: IXpService,
        private readonly _levelRepo: ILevelRepository,
        private readonly _badgeRepo: IBadgeRepository
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

        // Fetch populated badges
        let populatedBadges: Badge[] = [];
        if (user.badges && user.badges.length > 0) {
            populatedBadges = await this._badgeRepo.findByIds(user.badges);
        }

        return {
            user: UserDTOMapper.toResponse(user, populatedBadges),
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
