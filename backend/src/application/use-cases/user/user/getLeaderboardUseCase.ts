import { IUserGamificationRepository } from "../../../../domain/repositories/user/IUserGamificationRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";


export class GetLeaderboardUseCase {
    constructor(
        private readonly _userRepo: IUserGamificationRepository,
        private readonly _submissionRepo: ISubmissionRepository,
        private readonly _levelRepo: ILevelRepository
    ) { }

    async execute(
        page: number = 1,
        limit: number = 10,
        search: string = "",
        timeframe: "all-time" | "weekly" | "monthly" = "all-time"
    ): Promise<{ data: any[]; total: number }> {
        let users: any[] = [];
        let total = 0;

        if (timeframe === "all-time") {
            const result = await this._userRepo.getLeaderboard(page, limit, search);
            users = result.data;
            total = result.total;
        } else {
            const result = await this._submissionRepo.getLeaderboardByTimeframe(page, limit, timeframe, search);
            users = result.data;
            total = result.total;
        }

        const enrichedUsers = await Promise.all(users.map(async (user) => {

            let challengesSolved = user.challengesSolved;

            if (timeframe === "all-time") {
                challengesSolved = await this._submissionRepo.countSolved(user.id!);
            }

            const levelId = user.level_id || (user.snapshot && user.snapshot().level_id);
            const level = levelId ? await this._levelRepo.findById(levelId) : null;

            // Normalize the user object representation
            const userData = user.snapshot ? user.snapshot() : user;

            return {
                ...userData,
                id: user.id || userData.id, // ensure ID is at root
                challengesSolved,
                levelNumber: level ? level.levelNumber : 0,
                badgesCount: userData.badges?.length || 0
            };
        }));

        return {
            data: enrichedUsers,
            total,
        };
    }
}
