import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";


export class LogoutUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
  ) { }

  async execute(userId: string) {
    await this._userRepository.updateRefreshToken(userId, null);
    return { message: "Logged out successfully" };
  }
}
