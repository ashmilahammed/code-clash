import { IUser } from "../../domain/entities/User";
import { UserResponseDTO } from "../dto/UserResponseDTO";



export class UserMapper {
  static toDTO(domain: IUser): UserResponseDTO {
    return {
      id: domain.id!,
      username: domain.username,
      email: domain.email,

      xp: domain.xp,
      level_id: domain.level_id ?? null,
      avatar_id: domain.avatar_id ?? null,
      badge_id: domain.badge_id ?? null,

      current_streak: domain.current_streak,
      longest_streak: domain.longest_streak,

      is_premium: domain.is_premium,

      role: domain.role,
      status: domain.status,

      createdAt: (domain as any).createdAt,
      updatedAt: (domain as any).updatedAt,
    };
  }
}
