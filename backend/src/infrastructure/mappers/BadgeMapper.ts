import { Badge } from "../../domain/entities/badge/Badge";
import { IBadgeDoc } from "../database/models/badge/BadgeModel";

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
}
