import { IUserGamificationRepository } from "../../../../domain/repositories/user/IUserGamificationRepository";
import { ISubmissionRepository, ILeaderboardEntry } from "../../../../domain/repositories/submission/ISubmissionRepository";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { IGetLeaderboardUseCase } from "../../../interfaces/user/user/IGetLeaderboardUseCase";

export class GetLeaderboardUseCase implements IGetLeaderboardUseCase {
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
    ): Promise<{ data: ILeaderboardEntry[]; total: number }> {
        let users: ILeaderboardEntry[] = [];
        let total = 0;

        if (timeframe === "all-time") {
            const result = await this._userRepo.getLeaderboard(page, limit, search);
            users = result.data.map(user => {
                const snapshot = user.snapshot();
                return {
                    id: user.id as string,
                    username: snapshot.username,
                    avatar_url: snapshot.avatar || undefined,
                    xp: snapshot.xp,
                    challengesSolved: 0, // Will be computed below
                    level_id: snapshot.level_id,
                    badges: snapshot.badges
                } as unknown as ILeaderboardEntry;
            });
            total = result.total;
        } else {
            const result = await this._submissionRepo.getLeaderboardByTimeframe(page, limit, timeframe, search);
            users = result.data;
            total = result.total;
        }

        const enrichedUsers = await Promise.all(users.map(async (u) => {
            const user = u as ILeaderboardEntry & { level_id?: string; badges?: string[] };

            let challengesSolved = user.challengesSolved;

            if (timeframe === "all-time") {
                challengesSolved = await this._submissionRepo.countSolved(user.id);
            }

            const levelId = user.level_id;
            const level = levelId ? await this._levelRepo.findById(levelId) : null;

            return {
                ...user,
                challengesSolved,
                levelNumber: level ? level.levelNumber : 0,
                badgesCount: user.badges?.length || 0
            } as ILeaderboardEntry;
        }));

        return {
            data: enrichedUsers,
            total,
        };
    }
}
