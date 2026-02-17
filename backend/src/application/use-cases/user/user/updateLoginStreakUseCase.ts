import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class UpdateLoginStreakUseCase {
  constructor(
    private readonly _userRepo: IUserRepository
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
  }
}



