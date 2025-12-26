// import { IUser } from "../entities/User";


// export interface IUserRepository {
//   createUser(user: IUser): Promise<IUser>;
//   findByEmail(email: string): Promise<IUser | null>;
//   findById(id: string): Promise<IUser | null>;
// }




import { IUser } from "../entities/User";

export interface IUserRepository {
  createUser(user: Partial<IUser>): Promise<IUser>;

  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;

  updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<void>;

  saveOtp(
    id: string,
    otp: string | null,
    otpExpires: Date | null,
    resetVerifyField?: boolean
  ): Promise<void>;

  verifyUser(userId: string): Promise<void>;

  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
