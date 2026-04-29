import { User } from "../../../../domain/entities/user/User";

export interface IRemoveUserAvatarUseCase {
  execute(userId: string): Promise<User>;
}
