import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";


export class GetLeaderboardUseCase {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly submissionRepo: ISubmissionRepository,
        private readonly levelRepo: ILevelRepository
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
            const result = await this.userRepo.getLeaderboard(page, limit, search);
            users = result.data;
            total = result.total;
        } else {
            const result = await this.submissionRepo.getLeaderboardByTimeframe(page, limit, timeframe, search);
            users = result.data;
            total = result.total;
        }

        const enrichedUsers = await Promise.all(users.map(async (user) => {
            // For all-time, we need to count solved challenges. 
            // For weekly/monthly, we already aggregated it in the submission repository.
            let challengesSolved = user.challengesSolved;

            // if it's the all-time user model from userRepo, it won't have challengesSolved yet, it's a User domain object.
            // if it's from submissionRepo, it's a plain object with challengesSolved pre-aggregated.
            if (timeframe === "all-time") {
                challengesSolved = await this.submissionRepo.countSolved(user.id!);
            }

            const levelId = user.level_id || (user.snapshot && user.snapshot().level_id);
            const level = levelId ? await this.levelRepo.findById(levelId) : null;

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
