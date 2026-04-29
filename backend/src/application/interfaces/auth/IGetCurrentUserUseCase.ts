import { User } from "../../../domain/entities/user/User";

export interface IGetCurrentUserUseCase {
  execute(userId: string): Promise<User>;
}
