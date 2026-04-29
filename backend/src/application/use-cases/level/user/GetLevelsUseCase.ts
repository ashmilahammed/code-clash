import { Level } from "../../../../domain/entities/level/Level";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";

import { IGetLevelsUseCase } from "../../../interfaces/level/user/IGetLevelsUseCase";

export class GetLevelsUseCase implements IGetLevelsUseCase {
    constructor(
        private readonly _levelRepository: ILevelRepository
    ) { }

    async execute(): Promise<Level[]> {
        return this._levelRepository.findAll();
    }
}
