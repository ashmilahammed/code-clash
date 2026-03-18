import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";

export class GetBadgesUseCase {
    constructor(
        private readonly _badgeRepository: IBadgeRepository
    ) { }

    async execute(): Promise<Badge[]> {
        return this._badgeRepository.findAll();
    }
}
