import { User } from "../../../../domain/entities/user/User";

export interface IUpdateUserAvatarUseCase {
  execute(userId: string, file: Buffer): Promise<User>;
}
