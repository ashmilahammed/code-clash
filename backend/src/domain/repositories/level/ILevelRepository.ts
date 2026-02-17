import { Level } from "../../entities/level/Level";


export interface ILevelRepository {

  findAll(): Promise<Level[]>;

  //Core: resolve level from XP
  findByXp(xp: number): Promise<Level | null>;

  findByLevelNumber(levelNumber: number): Promise<Level | null>;

  findById(id: string): Promise<Level | null>;

  create(level: Level): Promise<Level>;

  update(id: string, data: Partial<Level>): Promise<Level | null>;

  delete(id: string): Promise<boolean>;
}
