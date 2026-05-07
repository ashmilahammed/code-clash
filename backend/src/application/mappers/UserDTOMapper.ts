import { User } from "../../domain/entities/user/User";
import { Badge } from "../../domain/entities/badge/Badge";

import { UserResponseDTO } from "../dto/user/UserResponseDTO";
import { AuthUserDTO } from "../dto/auth/AuthUserDTO";

import { BadgeDTOMapper } from "./BadgeDTOMapper";

export class UserDTOMapper {

  static toResponse(user: User, populatedBadges?: Badge[]): UserResponseDTO {
    const snap = user.snapshot();
    return {
      ...snap,
      badges: populatedBadges ? populatedBadges.map(b => BadgeDTOMapper.toResponse(b)) : null,
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
