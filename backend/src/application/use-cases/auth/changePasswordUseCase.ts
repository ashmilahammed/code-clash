import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await user.verifyPassword(currentPassword, this.passwordService);

    if (!isPasswordValid) {
        throw new Error("CURRENT_PASSWORD_INCORRECT");
    }

    const newHashedPassword = await this.passwordService.hash(newPassword);
    
    await this.userRepository.updatePassword(userId, newHashedPassword);
  }
}

