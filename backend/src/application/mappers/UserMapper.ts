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
      doc.badges?.map(b => b.toString()) ?? [],
      doc.level_id?.toString() ?? null,

      doc.xp,
      doc.current_streak,
      doc.longest_streak,
      doc.last_login_date ?? null,

      doc.is_premium,
      doc.premium_expiry_date ?? null,
      doc.premium_expiry_notification_sent,
      doc.date_joined,

      doc.role,
      doc.status,

      doc.refreshToken ?? null,

      doc.isVerified,
      doc.otp ?? null,
      doc.otpExpires ?? null,
      doc.banned_until ?? null,
      doc.ban_reason ?? null
    );
  }

  static toResponse(user: User, populatedBadges?: any[]): UserResponseDTO {
    const snap = user.snapshot();
    return {
      ...snap,
      badges: populatedBadges ?? null,
      badgesCount: snap.badges.length
    };
  }

  static toAuth(user: User): AuthUserDTO {
    const snap = user.snapshot();
    return {
      id: snap.id,
      username: snap.username,
      email: snap.email,
      role: snap.role,
      isVerified: snap.isVerified,
      avatar: snap.avatar,
      about: snap.about,
      github_url: snap.github_url,
      linkedin_url: snap.linkedin_url,
    };
  }
}
