import { Badge } from "../../domain/entities/badge/Badge";
import { BadgeResponseDTO } from "../dto/badge/BadgeResponseDTO";

export class BadgeDTOMapper {
  static toResponse(badge: Badge): BadgeResponseDTO {
    return {
      id: badge.id!,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      minXpRequired: badge.minXpRequired,
      category: badge.category,
      requirementType: badge.requirementType,
      requirementValue: badge.requirementValue,
      isActive: badge.isActive,
      ...(badge.createdAt && { createdAt: badge.createdAt }),
      ...(badge.updatedAt && { updatedAt: badge.updatedAt }),
    };
  }
}
