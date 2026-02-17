// import { IUser } from "../../entities/user/User";
import { User } from "../../entities/user/User";
import { ListQuery } from "../../types/ListQuery";
import { PaginatedResult } from "../../types/PaginatedResult";



export interface IUserRepository {
  //auth
  createUser(user: Partial<User>): Promise<User>;

  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;

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


  // admin
  // findAll(
  //   page: number,
  //   limit: number,
  //   filter?: { status?: "active" | "blocked" }
  // ): Promise<{ users: IUser[]; total: number }>;
  findAll(query: ListQuery): Promise<PaginatedResult<User>>;


  updateStatus(
    userId: string,
    status: "active" | "blocked"
  ): Promise<void>;


  updateLoginStreak(
    userId: string,
    currentStreak: number,
    longestStreak: number,
    lastLoginDate: Date
  ): Promise<void>;


  addXp(userId: string, xp: number): Promise<void>;



  // updateLevel(
  //   userId: string,
  //   levelNumber: number
  // ): Promise<void>;

  updateLevel(userId: string, levelId: string): Promise<void>;

  updateBadge(userId: string, badgeId: string): Promise<void>;

  getLeaderboard(limit?: number): Promise<User[]>;

  save(user: User): Promise<void>;

}








