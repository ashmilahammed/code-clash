import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";
import { UpdateBadgeDTO } from "../../dto/badge/UpdateBadgeDTO";

export class UpdateBadgeUseCase {
  constructor(
    private readonly _badgeRepository: IBadgeRepository
  ) {}

  async execute(id: string, dto: UpdateBadgeDTO): Promise<Badge> {

    const existing = await this._badgeRepository.findById(id);
    if (!existing) {
      throw new Error("BADGE_NOT_FOUND");
    }

    const updated = new Badge(
      existing.id,
      dto.name ?? existing.name,
      dto.description ?? existing.description,
      dto.icon ?? existing.icon,
      dto.minXpRequired ?? existing.minXpRequired,
      dto.category ?? existing.category,
      dto.requirementType ?? existing.requirementType,
      dto.requirementValue ?? existing.requirementValue,
      dto.isActive ?? existing.isActive,
      existing.createdAt,
      new Date()
    );

    return this._badgeRepository.updateEntity(updated);
  }
}