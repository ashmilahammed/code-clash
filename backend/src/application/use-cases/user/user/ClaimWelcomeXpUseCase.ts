import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class ClaimWelcomeXpUseCase {
  constructor(private readonly _userRepository: IUserRepository) { }

  async execute(userId: string): Promise<{ success: boolean; xp: number; }> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Only award welcome XP once per account. Let's assume if XP > 0, they already got something.
    // However, if we added is_first_login properly, we can use that if persisted, but XP = 0 is safe.
    if (user.getXp() > 0) {
      return { success: false, xp: user.getXp() };
    }

    user.addXp(50);
    // user.is_first_login = false; // We don't have this on backend User entity yet, but we will assume xp>0 acts as safety
    
    await this._userRepository.save(user);

    return { success: true, xp: user.getXp() };
  }
}
