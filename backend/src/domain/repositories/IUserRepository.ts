import { IUser } from "../entities/User";
import { ListQuery } from "../types/ListQuery";
import { PaginatedResult } from "../types/PaginatedResult";



export interface IUserRepository {
  //auth
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


  // admin
  // findAll(
  //   page: number,
  //   limit: number,
  //   filter?: { status?: "active" | "blocked" }
  // ): Promise<{ users: IUser[]; total: number }>;
  findAll(query: ListQuery): Promise<PaginatedResult<IUser>>;


  updateStatus(
    userId: string,
    status: "active" | "blocked"
  ): Promise<void>;
}












// import { IUser } from "../entities/User";


// export interface IUserRepository {
//   createUser(user: Partial<IUser>): Promise<IUser>;

//   findByEmail(email: string): Promise<IUser | null>;
//   findById(id: string): Promise<IUser | null>;

//   updateRefreshToken(
//     userId: string,
//     refreshToken: string | null
//   ): Promise<void>;

//   saveOtp(
//     id: string,
//     otp: string | null,
//     otpExpires: Date | null,
//     resetVerifyField?: boolean
//   ): Promise<void>;

//   verifyUser(userId: string): Promise<void>;

//   updatePassword(userId: string, hashedPassword: string): Promise<void>;



//   // admin
//   findAll(
//     page: number,
//     limit: number,
//     filter?: { status?: "active" | "blocked" }
//   ): Promise<{ users: IUser[]; total: number }>;


//   updateStatus(
//     userId: string,
//     status: "active" | "blocked"
//   ): Promise<void>;
// }









