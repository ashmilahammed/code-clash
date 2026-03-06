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
        search: string = ""
    ): Promise<{ data: any[]; total: number }> {
        const { data: users, total } = await this.userRepo.getLeaderboard(page, limit, search);

        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const [challengesSolved, level] = await Promise.all([
                this.submissionRepo.countSolved(user.id!),
                user.level_id ? this.levelRepo.findById(user.level_id) : null
            ]);

            return {
                ...user.snapshot(),
                challengesSolved,
                levelNumber: level ? level.levelNumber : 0,
                badgesCount: 0 // placeholder
            };
        }));

        return {
            data: enrichedUsers,
            total,
        };
    }
}
