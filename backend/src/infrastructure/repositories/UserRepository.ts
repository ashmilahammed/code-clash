import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUser } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";
import { BaseRepository } from "./BaseRepository";

import { IUserDoc } from "../database/models/UserModel";

export class UserRepository
  extends BaseRepository<IUserDoc>
  implements IUserRepository {

  constructor() {
    super(UserModel);
  }

  //  Mapper stays here (correct place)
  private toDomain(doc: any): IUser {
    return {
      id: doc._id.toString(),

      username: doc.username,
      email: doc.email,
      password: doc.password,

      avatar_id: doc.avatar_id?.toString() ?? null,
      badge_id: doc.badge_id?.toString() ?? null,
      level_id: doc.level_id?.toString() ?? null,

      xp: doc.xp,

      current_streak: doc.current_streak,
      longest_streak: doc.longest_streak,

      is_premium: doc.is_premium,

      date_joined: doc.date_joined,

      role: doc.role,
      status: doc.status,

      refreshToken: doc.refreshToken ?? null,

      isVerified: doc.isVerified,
      otp: doc.otp ?? null,
      otpExpires: doc.otpExpires ?? null,
    };
  }

  // ================= CREATE =================
  async createUser(user: IUser): Promise<IUser> {
    const created = await this.createRaw(user);
    return this.toDomain(created);
  }

  // ================= FIND =================
  async findByEmail(email: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<IUser | null> {
    const doc = await this.findByIdRaw(id);
    return doc ? this.toDomain(doc) : null;
  }

  // ================= AUTH =================
  async updateRefreshToken(
    id: string,
    refreshToken: string | null
  ): Promise<void> {
    await this.updateRaw(id, { refreshToken });
  }

  async saveOtp(
    id: string,
    otp: string | null,
    otpExpires: Date | null,
    resetVerifyField = false
  ): Promise<void> {
    await this.updateRaw(id, {
      otp,
      otpExpires,
      ...(resetVerifyField && { isVerified: false }),
    });
  }

  async verifyUser(id: string): Promise<void> {
    await this.updateRaw(id, {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });
  }

  async updatePassword(id: string, hashed: string): Promise<void> {
    await this.updateRaw(id, { password: hashed });
  }

  // ================= ADMIN =================
  async findAll(
    page: number,
    limit: number,
    filter?: { status?: "active" | "blocked" }
  ): Promise<{ users: IUser[]; total: number }> {

    const query: any = {};
    if (filter?.status) query.status = filter.status;

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.findManyRaw(query, skip, limit, { date_joined: -1 }),
      this.count(query),
    ]);

    return {
      users: docs.map((d) => this.toDomain(d)),
      total,
    };
  }

  async updateStatus(
    userId: string,
    status: "active" | "blocked"
  ): Promise<void> {
    await this.updateRaw(userId, { status });
  }
}





// import { IUserRepository } from "../../domain/repositories/IUserRepository";
// import { IUser } from "../../domain/entities/User";
// import { UserModel } from "../database/models/UserModel";


// export class UserRepository implements IUserRepository {

//     private toDomain(doc: any): IUser {
//         return {
//             id: doc._id.toString(),

//             username: doc.username,
//             email: doc.email,
//             password: doc.password,

//             avatar_id: doc.avatar_id?.toString() ?? null,
//             badge_id: doc.badge_id?.toString() ?? null,
//             level_id: doc.level_id?.toString() ?? null,

//             xp: doc.xp,

//             current_streak: doc.current_streak,
//             longest_streak: doc.longest_streak,

//             is_premium: doc.is_premium,

//             date_joined: doc.date_joined,

//             role: doc.role,
//             status: doc.status,

//             refreshToken: doc.refreshToken ?? null,

//             isVerified: doc.isVerified,
//             otp: doc.otp ?? null,
//             otpExpires: doc.otpExpires ?? null,

//         };
//     }

//     async createUser(user: IUser): Promise<IUser> {
//         const created = await UserModel.create(user);
//         return this.toDomain(created);
//     }


//     async findByEmail(email: string): Promise<IUser | null> {
//         const user = await UserModel.findOne({ email });
//         return user ? this.toDomain(user) : null;
//     }

//     async findById(id: string): Promise<IUser | null> {
//         const user = await UserModel.findById(id);
//         return user ? this.toDomain(user) : null;
//     }

//     async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
//         await UserModel.findByIdAndUpdate(id, { refreshToken });
//     }


//     ////
//     // async saveOtp(id: string, otp: string | null, otpExpires: Date | null): Promise<void> {
//     //     await UserModel.findByIdAndUpdate(id, {
//     //         otp,
//     //         otpExpires,
//     //         isVerified: false,
//     //     });
//     // }
//     async saveOtp(
//         id: string,
//         otp: string | null,
//         otpExpires: Date | null,
//         resetVerifyField: boolean = false // default = false
//     ) {
//         await UserModel.findByIdAndUpdate(id, {
//             otp,
//             otpExpires,
//             ...(resetVerifyField ? { isVerified: false } : {})
//         });
//     }



//     async verifyUser(id: string): Promise<void> {
//         await UserModel.findByIdAndUpdate(id, {
//             isVerified: true,
//             otp: null,
//             otpExpires: null,
//         });
//     }

//     async updatePassword(id: string, hashed: string) {
//         await UserModel.findByIdAndUpdate(id, { password: hashed });
//     }



//     async findAll(
//         page: number,
//         limit: number,
//         filter?: { status?: "active" | "blocked" }
//     ): Promise<{ users: IUser[]; total: number }> {
//         const query: any = {};

//         if (filter?.status) {
//             query.status = filter.status;
//         }

//         const skip = (page - 1) * limit;

//         const [users, total] = await Promise.all([
//             UserModel.find(query)
//                 .skip(skip)
//                 .limit(limit)
//                 .sort({ date_joined: -1 }),
//             UserModel.countDocuments(query),
//         ]);

//         return {
//             users: users.map((doc) => this.toDomain(doc)),
//             total,
//         };
//     }

//     async updateStatus(
//         userId: string,
//         status: "active" | "blocked"
//     ): Promise<void> {
//         await UserModel.findByIdAndUpdate(userId, { status });
//     }

// }
