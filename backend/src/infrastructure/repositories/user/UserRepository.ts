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


    async getLeaderboard(
        page: number = 1,
        limit: number = 10,
        search: string = ""
    ): Promise<{ data: User[]; total: number }> {
        const filter: any = { role: "user", status: "active" };

        if (search) {
            filter.username = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            UserModel.find(filter)
                .sort({ xp: -1 })
                .skip(skip)
                .limit(limit),
            UserModel.countDocuments(filter),
        ]);

        return {
            data: docs.map(UserMapper.toDomain),
            total,
        };
    }



    async save(user: User): Promise<void> {
        const snapshot = user.snapshot();

        await UserModel.updateOne(
            { _id: snapshot.id },
            {
                $set: {
                    username: snapshot.username,
                    email: snapshot.email,
                    avatar: snapshot.avatar,
                    avatarPublicId: user.avatarPublicId,
                    about: snapshot.about,
                    github_url: snapshot.github_url,
                    linkedin_url: snapshot.linkedin_url,
                    badge_id: snapshot.badge_id,
                    level_id: snapshot.level_id,
                    xp: snapshot.xp,
                    current_streak: snapshot.current_streak,
                    longest_streak: snapshot.longest_streak,
                    is_premium: snapshot.is_premium,
                    premium_expiry_date: snapshot.premium_expiry_date,
                    role: snapshot.role,
                    status: snapshot.status,
                    isVerified: snapshot.isVerified,
                },
            }
        );
    }



}





