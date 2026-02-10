import { ILevelRepository } from "../../../domain/repositories/level/ILevelRepository";
import { Level } from "../../../domain/entities/level/Level";
import { LevelModel } from "../../database/models/level/LevelModel";
import { LevelMapper } from "../../../application/mappers/LevelMapper";


export class LevelRepository implements ILevelRepository {

  async findAll(): Promise<Level[]> {
    const levels = await LevelModel.find().sort({ levelNumber: 1 });
    return levels.map(LevelMapper.toDomain);
  }


  async findByXp(xp: number): Promise<Level | null> {
    const level = await LevelModel.findOne({
      minXp: { $lte: xp },
      maxXp: { $gte: xp }
    });

    return level ? LevelMapper.toDomain(level) : null;
  }


  async findByLevelNumber(levelNumber: number): Promise<Level | null> {
    const level = await LevelModel.findOne({ levelNumber });
    return level ? LevelMapper.toDomain(level) : null;
  }


  async create(level: Level): Promise<Level> {
    const created = await LevelModel.create(
      LevelMapper.toPersistence(level)
    );

    return LevelMapper.toDomain(created);
  }

  
  async delete(id: string): Promise<void> {
    await LevelModel.findByIdAndDelete(id);
  }
}
