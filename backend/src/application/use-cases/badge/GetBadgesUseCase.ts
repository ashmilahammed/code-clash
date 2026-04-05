import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";

export class GetBadgesUseCase {
    constructor(
        private readonly _badgeRepository: IBadgeRepository
    ) { }

    async execute(page: number = 1, limit: number = 9, search?: string): Promise<{ badges: Badge[], total: number, totalPages: number }> {
        const skip = (page - 1) * limit;
        const result = await this._badgeRepository.findAllPaginated(skip, limit, search);
        
        return {
            badges: result.badges,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        };
    }
}
