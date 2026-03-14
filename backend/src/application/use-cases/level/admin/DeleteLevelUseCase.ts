import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";

export class DeleteLevelUseCase {
    constructor(
        private readonly _levelRepository: ILevelRepository
    ) { }

    async execute(id: string): Promise<boolean> {
        const existingLevel = await this._levelRepository.findById(id);
        if (!existingLevel) {
            throw new Error("Level not found");
        }
        return this._levelRepository.delete(id);
    }
}
