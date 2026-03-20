import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";


export class LogoutUseCase {
  constructor(
    private readonly _userRepository: IUserAuthRepository
  ) { }

  async execute(userId: string) {
    await this._userRepository.updateRefreshToken(userId, null);
    return { message: "Logged out successfully" };
  }
}
