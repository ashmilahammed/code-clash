import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";
import { ILogoutUseCase } from "../../interfaces/auth/ILogoutUseCase";

export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    private readonly _userRepository: IUserAuthRepository
  ) { }

  async execute(userId: string) {
    await this._userRepository.updateRefreshToken(userId, null);
  }
}