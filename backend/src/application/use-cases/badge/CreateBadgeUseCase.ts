import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";

interface CreateBadgeDTO {
    name: string;
    description: string;
    icon: string;
    minXpRequired?: number;
    category?: string;
    requirementType?: string;
    requirementValue?: number;
    isActive?: boolean;
}

export class CreateBadgeUseCase {
    constructor(private readonly badgeRepository: IBadgeRepository) { }

    async execute(dto: CreateBadgeDTO): Promise<Badge> {
        const badge = new Badge(
            undefined,
            dto.name,
            dto.description,
            dto.icon,
            dto.minXpRequired || 0,
            dto.category || "Achievement",
            dto.requirementType || "Manual",
            dto.requirementValue || 0,
            dto.isActive !== undefined ? dto.isActive : true
        );
        return this.badgeRepository.create(badge);
    }
}
