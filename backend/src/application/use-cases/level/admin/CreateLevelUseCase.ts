import { ILevelRepository } from "../../../../domain/repositories/level/ILevelRepository";
import { Level } from "../../../../domain/entities/level/Level";
import { CreateLevelDTO } from "../../../dto/level/CreateLevelDTO";


export class CreateLevelUseCase {
  constructor(
    private readonly _levelRepository: ILevelRepository
  ) { }

  async execute(dto: CreateLevelDTO): Promise<Level> {
    const { levelNumber, minXp, maxXp, title } = dto;

    // Prevent duplicate level number
    const existingLevel =
      await this._levelRepository.findByLevelNumber(levelNumber);

    if (existingLevel) {
      throw new Error(`Level ${levelNumber} already exists`);
    }

    //
    if (levelNumber > 1) {
      const previousLevel =
        await this._levelRepository.findByLevelNumber(levelNumber - 1);

      if (!previousLevel) {
        throw new Error(
          `Cannot create level ${levelNumber} without level ${levelNumber - 1}`
        );
      }
    }

    // 
    const allLevels = await this._levelRepository.findAll();

    const hasOverlap = allLevels.some(
      (level) =>
        !(maxXp < level.minXp || minXp > level.maxXp)
    );

    if (hasOverlap) {
      throw new Error("XP range overlaps with an existing level");
    }

    // Create domain entity (self-validates)
    const level = new Level(
      undefined,
      levelNumber,
      minXp,
      maxXp,
      title
    );

    //
    return this._levelRepository.create(level);
  }
}
