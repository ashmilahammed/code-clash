import { User } from "../../domain/entities/user/User";
import { IUserDoc } from "../../infrastructure/database/models/user/UserModel";
import { UserResponseDTO } from "../dto/user/UserResponseDTO";
import { AuthUserDTO } from "../dto/auth/AuthUserDTO";


export class UserMapper {

  static toDomain(doc: IUserDoc): User {
    return new User(
      doc._id.toString(),
      doc.username,
      doc.email,
      doc.password ?? null,

      doc.avatar ?? null,
      doc.avatarPublicId ?? null,

      doc.about ?? null,
      doc.github_url ?? null,
      doc.linkedin_url ?? null,

      doc.badge_id?.toString() ?? null,
      doc.level_id?.toString() ?? null,

      doc.xp,
      doc.current_streak,
      doc.longest_streak,
      doc.last_login_date ?? null,

      doc.is_premium,
      doc.date_joined,

      doc.role,
      doc.status,

      doc.refreshToken ?? null,

      doc.isVerified,
      doc.otp ?? null,
      doc.otpExpires ?? null
    );
  }

  static toResponse(user: User): UserResponseDTO {
    return user.snapshot();
  }

  static toAuth(user: User): AuthUserDTO {
    return {
      id: user.snapshot().id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
