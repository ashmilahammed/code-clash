import { IUserCoreRepository } from "../../../domain/repositories/user/IUserCoreRepository";
import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { ChangePasswordDTO } from "../../dto/auth/ChangePasswordDTO";


export class ChangePasswordUseCase {
  constructor(
    private readonly _userRepository: IUserCoreRepository & IUserAuthRepository,
    private readonly _passwordService: IPasswordService
  ) { }

  async execute(dto: ChangePasswordDTO): Promise<void> {

    const { userId, currentPassword, newPassword } = dto;

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.verifyPassword(currentPassword, this._passwordService);

    if (!isPasswordValid) {
      throw new Error("CURRENT_PASSWORD_INCORRECT");
    }

    const newHashedPassword = await this._passwordService.hash(newPassword);

    await this._userRepository.updatePassword(userId, newHashedPassword);
  }
}

