import { IUserRepository } from "../../../domain/repositories/IUserRepository";


export class LogoutUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
    return { message: "Logged out successfully" };
  }
}
