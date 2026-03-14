import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { ChangePasswordDTO } from "../../dto/auth/ChangePasswordDTO";


export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) { }

  async execute(dto: ChangePasswordDTO): Promise<void> {

    const { userId, currentPassword, newPassword } = dto;

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

