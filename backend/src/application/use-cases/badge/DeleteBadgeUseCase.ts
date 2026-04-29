import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";
import { IDeleteBadgeUseCase } from "../../interfaces/badge/IDeleteBadgeUseCase";

export class DeleteBadgeUseCase implements IDeleteBadgeUseCase {
    constructor(
        private readonly _badgeRepository: IBadgeRepository
    ) { }

    async execute(id: string): Promise<boolean> {
        return this._badgeRepository.delete(id);
    }
}
