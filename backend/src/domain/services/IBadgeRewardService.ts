import { User } from "../entities/user/User";

export interface IBadgeRewardService {
    checkAndReward(user: User, type: string, value: number): Promise<string[]>;
}
