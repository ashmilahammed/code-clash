import { ILevelCalculator } from "../../domain/services/ILevelCalculator";
import { ILevelRepository } from "../../domain/repositories/level/ILevelRepository";
import { Level } from "../../domain/entities/level/Level";



export class LevelCalculator implements ILevelCalculator {
  constructor(
    private readonly levelRepo: ILevelRepository
  ) {}

  async resolveLevel(xp: number): Promise<Level | null> {
    return await this.levelRepo.findByXp(xp);
  }
}
