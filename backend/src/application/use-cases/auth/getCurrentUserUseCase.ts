import { User } from "../../../domain/entities/user/User";
import { IUserCoreRepository } from "../../../domain/repositories/user/IUserCoreRepository";

export class GetCurrentUserUseCase {
  constructor(
    private readonly _userRepository: IUserCoreRepository
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user; // domain entity
  }
}


