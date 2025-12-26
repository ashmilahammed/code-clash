import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";

export class ResetPasswordUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, newPassword: string) {
    const hashed = await PasswordService.hashPassword(newPassword);

    await this.userRepo.updatePassword(userId, hashed);

    // logout from all devices
    await this.userRepo.updateRefreshToken(userId, null);

    return { message: "Password reset successfully" };
  }
}
