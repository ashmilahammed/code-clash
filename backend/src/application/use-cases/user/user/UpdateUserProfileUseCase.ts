import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { User } from "../../../../domain/entities/user/User";

export class UpdateUserProfileUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(
    userId: string,
    data: {
      username?: string;
      about?: string;
      github_url?: string;
      linkedin_url?: string;
    }
  ): Promise<User> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.username !== undefined) user.username = data.username;
    if (data.about !== undefined) user.about = data.about;
    if (data.github_url !== undefined) user.github_url = data.github_url;
    if (data.linkedin_url !== undefined) user.linkedin_url = data.linkedin_url;

    await this._userRepository.save(user);

    return user;
  }
}
