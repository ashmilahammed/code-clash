// export interface ILevelCalculator {
//   resolveLevel(xp: number): Promise<{
//     levelNumber: number;
//     title?: string;
//   }>;
// }

import { Level } from "../entities/level/Level";

export interface ILevelCalculator {
  resolveLevel(xp: number): Promise<Level | null>;
}
