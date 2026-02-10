// import { IUser } from "../../domain/entities/user/User";
// import { UserResponseDTO } from "../dto/user/UserResponseDTO";
// import { AuthUserDTO } from "../dto/auth/AuthUserDTO";



// export class UserMapper {

//   //user response
//   static toResponse(domain: IUser): UserResponseDTO {
//     return {
//       id: domain.id!,
//       username: domain.username,
//       email: domain.email,

//       xp: domain.xp,
//       level_id: domain.level_id ?? null,
//       avatar_id: domain.avatar_id ?? null,
//       badge_id: domain.badge_id ?? null,

//       current_streak: domain.current_streak,
//       longest_streak: domain.longest_streak,

//       is_premium: domain.is_premium,

//       role: domain.role,
//       status: domain.status,

//       //
//       // ...(domain.createdAt && { createdAt: domain.createdAt }),
//       // ...(domain.updatedAt && { updatedAt: domain.updatedAt }),
//     };
//   }

//   //auth user
//   static toAuth(domain: IUser): AuthUserDTO {
//     return {
//       id: domain.id!,
//       username: domain.username,
//       email: domain.email,
//       role: domain.role,
//       isVerified: domain.isVerified,
//     };
//   }
// }






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

      doc.avatar_id?.toString() ?? null,
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
