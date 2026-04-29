import { Level } from "../../../../domain/entities/level/Level";

export interface IGetLevelsUseCase {
  execute(): Promise<Level[]>;
}
