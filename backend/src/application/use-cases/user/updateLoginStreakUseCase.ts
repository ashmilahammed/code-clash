import { IUserRepository } from "../../../domain/repositories/IUserRepository";



export class UpdateLoginStreakUseCase {
    constructor(private readonly _userRepo: IUserRepository) { }

    async execute(userId: string): Promise<void> {
        const user = await this._userRepo.findById(userId);
        if (!user) return;

        // Normalize "today" to UTC day start
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let currentStreak = user.current_streak;
        let longestStreak = user.longest_streak;

        if (user.last_login_date) {
            const lastLogin = new Date(user.last_login_date);
            lastLogin.setUTCHours(0, 0, 0, 0);

            //   const diffDays =
            //     (today.getTime() - lastLogin.getTime()) /
            //     (1000 * 60 * 60 * 24);

            const diffDays = Math.floor(
                (today.getTime() - lastLogin.getTime()) /
                (1000 * 60 * 60 * 24)
            );


            if (diffDays === 1) {
                currentStreak += 1;
            } else if (diffDays > 1) {
                currentStreak = 1;
            }
            // diffDays === 0 (same day)
        } else {
            // First ever login
            currentStreak = 1;
        }

        longestStreak = Math.max(longestStreak, currentStreak);

        await this._userRepo.updateLoginStreak(
            user.id!,
            currentStreak,
            longestStreak,
            new Date() // actual login timestamp
        );
    }
}
