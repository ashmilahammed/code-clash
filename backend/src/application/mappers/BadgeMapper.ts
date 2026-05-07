import { Badge } from "../../domain/entities/badge/Badge";
import { IBadgeDoc } from "../../infrastructure/database/models/badge/BadgeModel";
import { BadgeResponseDTO } from "../dto/badge/BadgeResponseDTO";

export class BadgeMapper {
  static toDomain(doc: IBadgeDoc): Badge {
    return new Badge(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.icon,
      doc.minXpRequired,
      doc.category,
      doc.requirementType,
      doc.requirementValue,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toResponse(badge: Badge | IBadgeDoc): BadgeResponseDTO {
    if (badge instanceof Badge) {
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

        // createdAt: badge.createdAt,
        // updatedAt: badge.updatedAt,
        ...(badge.createdAt && { createdAt: badge.createdAt }),
        ...(badge.updatedAt && { updatedAt: badge.updatedAt }),
      };
    }

    return {
      id: badge._id.toString(),
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      minXpRequired: badge.minXpRequired,
      category: badge.category,
      requirementType: badge.requirementType,
      requirementValue: badge.requirementValue,
      isActive: badge.isActive,
      // createdAt: badge.createdAt,
      // updatedAt: badge.updatedAt,
      ...(badge.createdAt && { createdAt: badge.createdAt }),
      ...(badge.updatedAt && { updatedAt: badge.updatedAt }),
    };
  }
}
