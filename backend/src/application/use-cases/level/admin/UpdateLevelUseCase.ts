import { Level } from "../../../../domain/entities/level/Level";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { UpdateLevelDTO } from "../../../dto/level/UpdateLevelDTO";


export class UpdateLevelUseCase {
    constructor(
        private readonly _levelRepository: ILevelRepository
    ) { }

    // async execute(id: string, dto: Partial<CreateLevelDTO>): Promise<Level | null> {
    //     const existingLevel = await this._levelRepository.findById(id);
    //     if (!existingLevel) {
    //         throw new Error("Level not found");
    //     }

    //     return this._levelRepository.update(id, dto);
    // }

    async execute(id: string, dto: UpdateLevelDTO): Promise<Level> {

        const existing = await this._levelRepository.findById(id);

        if (!existing) {
            throw new Error("LEVEL_NOT_FOUND");
        }

        const updated = new Level(
            existing.id,
            dto.levelNumber ?? existing.levelNumber,
            dto.minXp ?? existing.minXp,
            dto.maxXp ?? existing.maxXp,
            dto.title ?? existing.title,
            existing.createdAt,
            new Date()
        );

        //IMPORTANT: re-validate overlap
        const allLevels = await this._levelRepository.findAll();

        const overlap = allLevels.some(
            (lvl) =>
                lvl.id !== id &&
                !(updated.maxXp < lvl.minXp || updated.minXp > lvl.maxXp)
        );

        if (overlap) {
            throw new Error("XP_RANGE_OVERLAP");
        }

        return this._levelRepository.updateEntity(updated);
    }
}
