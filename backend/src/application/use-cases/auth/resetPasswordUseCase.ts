import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";


export class ResetPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _passwordService: IPasswordService
  ) {}

  async execute(userId: string, newPassword: string): Promise<void> {
    const hashed = await this._passwordService.hash(newPassword);

    await this._userRepo.updatePassword(userId, hashed);

    // logout from all devices
    await this._userRepo.updateRefreshToken(userId, null);
  }
}
