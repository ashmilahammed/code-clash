import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { ResetPasswordDTO } from "../../dto/auth/ResetPasswordDTO";


export class ResetPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserAuthRepository,
    private readonly _passwordService: IPasswordService
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {

    const hashed = await this._passwordService.hash(dto.newPassword);

    await this._userRepo.updatePassword(dto.userId, hashed);

    // logout from all devices
    await this._userRepo.updateRefreshToken(dto.userId, null);
  }
}