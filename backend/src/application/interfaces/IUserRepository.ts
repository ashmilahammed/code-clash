import { IUser } from "../../domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  createUser(data: Partial<IUser>): Promise<IUser>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;

}

