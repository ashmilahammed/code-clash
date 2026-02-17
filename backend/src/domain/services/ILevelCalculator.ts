import { Level } from "../entities/level/Level";

export interface ILevelCalculator {
  resolveLevel(xp: number): Promise<Level | null>;
}
