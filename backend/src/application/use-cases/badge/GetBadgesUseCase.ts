import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";

export class GetBadgesUseCase {
    constructor(private readonly badgeRepository: IBadgeRepository) { }

    async execute(): Promise<Badge[]> {
        return this.badgeRepository.findAll();
    }
}
