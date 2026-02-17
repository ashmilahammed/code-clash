import { Level } from "../../../../domain/entities/level/Level";
import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { CreateLevelDTO } from "../../../dto/level/CreateLevelDTO"; // Reusing DTO or create UpdateLevelDTO


export class UpdateLevelUseCase {
    constructor(private readonly levelRepository: ILevelRepository) { }

    async execute(id: string, dto: Partial<CreateLevelDTO>): Promise<Level | null> {
        const existingLevel = await this.levelRepository.findById(id);
        if (!existingLevel) {
            throw new Error("Level not found");
        }

        return this.levelRepository.update(id, dto);
    }
}
