import { User } from "../../../../domain/entities/user/User";

export interface IUpdateUserProfileUseCase {
  execute(
    userId: string,
    data: {
      username?: string;
      about?: string;
      github_url?: string;
      linkedin_url?: string;
    }
  ): Promise<User>;
}
