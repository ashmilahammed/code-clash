// import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
// import { IUser } from "../../../domain/entities/user/User";
// import { UserModel } from "../../database/models/user/UserModel";
// import { BaseRepository } from "../BaseRepository";

// import { IUserDoc } from "../../database/models/user/UserModel";

// import { ListQuery } from "../../../domain/types/ListQuery";
// import { PaginatedResult } from "../../../domain/types/PaginatedResult";



// export class UserRepository
//     extends BaseRepository<IUserDoc>
//     implements IUserRepository {

//     constructor() {
//         super(UserModel);
//     }

//     //  Mapper 
//     private toDomain(doc: IUserDoc): IUser {
//         return {
//             id: doc._id.toString(),

//             username: doc.username,
//             email: doc.email,
//             // password: doc.password,
//             password: doc.password ?? null,


//             avatar_id: doc.avatar_id?.toString() ?? null,
//             badge_id: doc.badge_id?.toString() ?? null,
//             level_id: doc.level_id?.toString() ?? null,

//             xp: doc.xp,

//             current_streak: doc.current_streak,
//             longest_streak: doc.longest_streak,
//             last_login_date: doc.last_login_date ?? null,

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

//     //
//     async createUser(user: Partial<IUser>): Promise<IUser> {
//         const created = await this.createRaw(user);
//         return this.toDomain(created);
//     }

//     //
//     async findByEmail(email: string): Promise<IUser | null> {
//         const doc = await UserModel.findOne({ email }).exec();
//         return doc ? this.toDomain(doc) : null;
//     }

//     async findById(id: string): Promise<IUser | null> {
//         const doc = await this.findByIdRaw(id);
//         return doc ? this.toDomain(doc) : null;
//     }

//     //auth
//     async updateRefreshToken(
//         id: string,
//         refreshToken: string | null
//     ): Promise<void> {
//         await this.updateRaw(id, { refreshToken });
//     }

//     async saveOtp(
//         id: string,
//         otp: string | null,
//         otpExpires: Date | null,
//         resetVerifyField = false
//     ): Promise<void> {
//         await this.updateRaw(id, {
//             otp,
//             otpExpires,
//             ...(resetVerifyField && { isVerified: false }),
//         });
//     }

//     async verifyUser(id: string): Promise<void> {
//         await this.updateRaw(id, {
//             isVerified: true,
//             otp: null,
//             otpExpires: null,
//         });
//     }

//     async updatePassword(id: string, hashed: string): Promise<void> {
//         await this.updateRaw(id, { password: hashed });
//     }


//     //Admin
//     async findAll(query: ListQuery): Promise<PaginatedResult<IUser>> {
//         const {
//             page,
//             limit,
//             search,
//             status,
//             sortBy = "date_joined",
//             sortOrder = "desc",
//         } = query;

//         // const mongoQuery: any = {};
//         const mongoQuery: Record<string, unknown> = {};


//         // filter by status
//         if (status) {
//             mongoQuery.status = status;
//         }

//         // search by username
//         if (search) {
//             mongoQuery.username = { $regex: search, $options: "i" };
//         }

//         const skip = (page - 1) * limit;
//         const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

//         const [docs, total] = await Promise.all([
//             this.findManyRaw(mongoQuery, skip, limit, sort),
//             this.count(mongoQuery),
//         ]);

//         return {
//             data: docs.map((d) => this.toDomain(d)),
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         };
//     }




//     async updateStatus(
//         userId: string,
//         status: "active" | "blocked"
//     ): Promise<void> {
//         await this.updateRaw(userId, { status });
//     }




//     async updateLoginStreak(
//         userId: string,
//         currentStreak: number,
//         longestStreak: number,
//         lastLoginDate: Date
//     ): Promise<void> {
//         await UserModel.updateOne(
//             { _id: userId },
//             {
//                 $set: {
//                     current_streak: currentStreak,
//                     longest_streak: longestStreak,
//                     last_login_date: lastLoginDate,
//                 },
//             }
//         );
//     }



//     async addXp(userId: string, xp: number): Promise<void> {
//         await UserModel.updateOne(
//             { _id: userId },
//             { $inc: { xp } }
//         );
//     }


// }








import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { User } from "../../../domain/entities/user/User";
import { UserModel } from "../../database/models/user/UserModel";
import { BaseRepository } from "../BaseRepository";
import { UserMapper } from "../../../application/mappers/UserMapper";
import { ListQuery } from "../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../domain/types/PaginatedResult";
import { IUserDoc } from "../../database/models/user/UserModel";



export class UserRepository
    extends BaseRepository<IUserDoc>
    implements IUserRepository {

    constructor() {
        super(UserModel);
    }

    async createUser(user: Partial<User>): Promise<User> {
        const created = await this.createRaw(user);
        return UserMapper.toDomain(created);
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email });
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async findById(id: string): Promise<User | null> {
        const doc = await this.findByIdRaw(id);
        return doc ? UserMapper.toDomain(doc) : null;
    }

    //auth
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


    //Admin
    async findAll(query: ListQuery): Promise<PaginatedResult<User>> {
        const {
            page,
            limit,
            search,
            status,
            sortBy = "date_joined",
            sortOrder = "desc",
        } = query;

        // const mongoQuery: any = {};
        const mongoQuery: Record<string, unknown> = {};


        // filter by status
        if (status) {
            mongoQuery.status = status;
        }

        // search by username
        if (search) {
            mongoQuery.username = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        const [docs, total] = await Promise.all([
            this.findManyRaw(mongoQuery, skip, limit, sort),
            this.count(mongoQuery),
        ]);

        return {
            // data: docs.map((d) => this.toDomain(d)),
            data: docs.map(UserMapper.toDomain),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }




    async updateStatus(
        userId: string,
        status: "active" | "blocked"
    ): Promise<void> {
        await this.updateRaw(userId, { status });
    }



    async updateLoginStreak(
        userId: string,
        currentStreak: number,
        longestStreak: number,
        lastLoginDate: Date
    ): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            {
                $set: {
                    current_streak: currentStreak,
                    longest_streak: longestStreak,
                    last_login_date: lastLoginDate,
                },
            }
        );
    }



    async addXp(userId: string, xp: number): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            { $inc: { xp } }
        );
    }




    // async updateLevel(
    //     userId: string,
    //     levelNumber: number
    // ): Promise<void> {
    //     await UserModel.updateOne(
    //         { _id: userId },
    //         { $set: { level_id: levelNumber } }
    //     );
    // }


    async updateLevel(userId: string, levelId: string): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            { $set: { level_id: levelId } }
        );
    }


    async updateBadge(userId: string, badgeId: string): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            { $set: { badge_id: badgeId } }
        );
    }


    async getLeaderboard(limit = 10): Promise<User[]> {
        const docs = await UserModel.find({
            role: "user",
            status: "active",
        })
            .sort({ xp: -1 })
            .limit(limit);

        return docs.map(UserMapper.toDomain);
    }

}



