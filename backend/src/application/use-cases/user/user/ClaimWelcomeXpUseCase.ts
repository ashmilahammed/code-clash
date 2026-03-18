import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class ClaimWelcomeXpUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
  ) { }

  async execute(userId: string): Promise<{ success: boolean; xp: number; }> {

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.getXp() > 0) {
      return { success: false, xp: user.getXp() };
    }

    user.addXp(50);
    
    await this._userRepository.save(user);

    return { success: true, xp: user.getXp() };
  }
}
