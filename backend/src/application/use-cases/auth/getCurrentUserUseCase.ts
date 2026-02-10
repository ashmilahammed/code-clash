// import { IUser } from "../../../domain/entities/user/User";
import { User } from "../../../domain/entities/user/User";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";

export class GetCurrentUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user; // DOMAIN entity
  }
}


