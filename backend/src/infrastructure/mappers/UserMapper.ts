import { User } from "../../domain/entities/user/User";
import { IUserDoc } from "../database/models/user/UserModel";

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
}
