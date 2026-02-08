import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IXpService } from "../../../domain/services/IXpService";


export class GetDashboardUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _xpService: IXpService
    ) { }

    async execute(userId: string) {
        const user = await this._userRepo.findById(userId);
        if (!user) throw new Error("USER_NOT_FOUND");

        const levelInfo = this._xpService.getLevelInfo(user.xp);

        const streakDates = this.buildStreakDates(
            user.current_streak,
            user.last_login_date
        );

        return {
            user,

            level: {
                level: levelInfo.level,
                currentXp: user.xp,
                nextLevelXp: levelInfo.nextLevelXp,
            },

            streak: {
                current: user.current_streak,
                longest: user.longest_streak,
                dates: streakDates,
            },
        };
    }


    // PURE helper (no side effects)
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

            //   dates.push(d.toISOString().split("T")[0]);
            dates.push(d.toISOString().split("T")[0]!);

        }

        return dates.reverse(); // oldest → newest
    }
}







// import { IUserRepository } from "../../../domain/repositories/IUserRepository";



// export class GetDashboardUseCase {
//   constructor(private readonly _userRepo: IUserRepository) {}

//   async execute(userId: string) {
//     const user = await this._userRepo.findById(userId);
//     if (!user) throw new Error("USER_NOT_FOUND");

//     return {
//       user,
//       // later:
//       // level
//       // streak calendar
//       // challenges
//     };
//   }
// }
