import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IBadgeRewardService } from "../../../../domain/services/IBadgeRewardService";
import { Badge } from "../../../../domain/entities/badge/Badge";

export class UpdateLoginStreakUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _badgeRewardService: IBadgeRewardService
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) return;

    // 
    user.recordLogin(new Date());

    // Persist updated streaks
    await this._userRepo.updateLoginStreak(
      user.id!,
      user.getStreaks().current,
      user.getStreaks().longest,
      new Date()
    );

    // Automatic Badge Rewards - STREAK
    await this._badgeRewardService.checkAndReward(user, Badge.REQUIREMENT_TYPES.STREAK_ACHIEVED, user.getStreaks().current);
  }
}



