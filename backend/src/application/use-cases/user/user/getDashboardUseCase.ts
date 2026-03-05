import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IXpService } from "../../../../domain/services/IXpService";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";


export class GetDashboardUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _xpService: IXpService,
        private readonly _levelRepo: ILevelRepository
    ) { }

    async execute(userId: string) {

        const user = await this._userRepo.findById(userId);
        if (!user) throw new Error("USER_NOT_FOUND");

        // const levelInfo = this._xpService.getLevelInfo(user.xp);

        // const streakDates = this.buildStreakDates(
        //     user.current_streak,
        //     user.last_login_date
        // );
        // return {
        //     user,

        //     level: {
        //         level: levelInfo.level,
        //         currentXp: user.xp,
        //         nextLevelXp: levelInfo.nextLevelXp,
        //     },

        //     streak: {
        //         current: user.current_streak,
        //         longest: user.longest_streak,
        //         dates: streakDates,
        //     },
        // };

        //
        const xp = user.getXp();
        const streak = user.getStreaks();

        const levelInfo = await this._levelRepo.findByXp(xp);

        // Build streak dates
        const streakDates = this.buildStreakDates(
            streak.current,
            streak.lastLoginDate
        );


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





