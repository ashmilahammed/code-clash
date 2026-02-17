import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";

export class DeleteBadgeUseCase {
    constructor(private readonly badgeRepository: IBadgeRepository) { }

    async execute(id: string): Promise<boolean> {
        return this.badgeRepository.delete(id);
    }
}
