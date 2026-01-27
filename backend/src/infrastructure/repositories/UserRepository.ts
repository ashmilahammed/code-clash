import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUser } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";
import { BaseRepository } from "./BaseRepository";

import { IUserDoc } from "../database/models/UserModel";

import { ListQuery } from "../../domain/types/ListQuery";
import { PaginatedResult } from "../../domain/types/PaginatedResult";



export class UserRepository
    extends BaseRepository<IUserDoc>
    implements IUserRepository {

    constructor() {
        super(UserModel);
    }

    //  Mapper stays here 
    private toDomain(doc: IUserDoc): IUser {
        return {
            id: doc._id.toString(),

            username: doc.username,
            email: doc.email,
            // password: doc.password,
            password: doc.password ?? null,


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

    //
    async createUser(user: Partial<IUser>): Promise<IUser> {
        const created = await this.createRaw(user);
        return this.toDomain(created);
    }

    //
    async findByEmail(email: string): Promise<IUser | null> {
        const doc = await UserModel.findOne({ email }).exec();
        return doc ? this.toDomain(doc) : null;
    }

    async findById(id: string): Promise<IUser | null> {
        const doc = await this.findByIdRaw(id);
        return doc ? this.toDomain(doc) : null;
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
    // async findAll(query: ListQuery): Promise<PaginatedResult<IUser>> {
    //     const {
    //         page,
    //         limit,
    //         search,
    //         filters,
    //         sortBy = "date_joined",
    //         sortOrder = "desc",
    //     } = query;

    //     const mongoQuery: any = {};

    //     // filter by status
    //     if (filters?.status) {
    //         mongoQuery.status = filters.status;
    //     }

    //     // search by username
    //     if (search) {
    //         mongoQuery.username = { $regex: search, $options: "i" };
    //     }

    //     const skip = (page - 1) * limit;
    //     const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    //     const [docs, total] = await Promise.all([
    //         this.findManyRaw(mongoQuery, skip, limit, sort),
    //         this.count(mongoQuery),
    //     ]);

    //     return {
    //         data: docs.map((d) => this.toDomain(d)),
    //         page,
    //         limit,
    //         total,
    //         totalPages: Math.ceil(total / limit),
    //     };
    // }

    async findAll(query: ListQuery): Promise<PaginatedResult<IUser>> {
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
            data: docs.map((d) => this.toDomain(d)),
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


}




