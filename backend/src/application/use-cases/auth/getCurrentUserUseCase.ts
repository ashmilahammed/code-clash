import { IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetCurrentUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<IUser> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user; // DOMAIN entity
  }
}


