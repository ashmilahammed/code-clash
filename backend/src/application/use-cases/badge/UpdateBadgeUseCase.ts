import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";

interface UpdateBadgeDTO {
    name?: string;
    description?: string;
    icon?: string;
    minXpRequired?: number;
    category?: string;
    requirementType?: string;
    requirementValue?: number;
    isActive?: boolean;
}

export class UpdateBadgeUseCase {
    constructor(private readonly badgeRepository: IBadgeRepository) { }

    async execute(id: string, dto: UpdateBadgeDTO): Promise<Badge | null> {
        return this.badgeRepository.update(id, dto);
    }
}
