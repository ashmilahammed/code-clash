import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { IDeleteLevelUseCase } from "../../../interfaces/level/admin/IDeleteLevelUseCase";


export class DeleteLevelUseCase implements IDeleteLevelUseCase {
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
