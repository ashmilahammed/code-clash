import { Level } from "../../../../domain/entities/level/Level";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";

export class GetLevelsUseCase {
    constructor(
        private readonly _levelRepository: ILevelRepository
    ) { }

    async execute(): Promise<Level[]> {
        return this._levelRepository.findAll();
    }
}
