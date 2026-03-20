import { User } from "../../entities/user/User";

export interface IUserCoreRepository {
  createUser(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
