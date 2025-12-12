import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUser } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";


export class UserRepository implements IUserRepository {

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

        };
    }

    async createUser(user: IUser): Promise<IUser> {
        const created = await UserModel.create(user);
        return this.toDomain(created);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email });
        return user ? this.toDomain(user) : null;
    }

    async findById(id: string): Promise<IUser | null> {
        const user = await UserModel.findById(id);
        return user ? this.toDomain(user) : null;
    }

    async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
        await UserModel.findByIdAndUpdate(id, { refreshToken });
    }
}
