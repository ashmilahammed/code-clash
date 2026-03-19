import { ILevelRepository } from "../../../domain/repositories/level/ILevelRepository";
import { Level } from "../../../domain/entities/level/Level";
import { LevelModel, ILevelDoc } from "../../database/models/level/LevelModel";
import { LevelMapper } from "../../../application/mappers/LevelMapper";
import { BaseRepository } from "../BaseRepository";


export class LevelRepository
  extends BaseRepository<ILevelDoc>
  implements ILevelRepository {

  constructor() {
    super(LevelModel);
  }

  async findAll(): Promise<Level[]> {
    const docs = await this._model
      .find()
      .sort({ levelNumber: 1 })
      .exec();

    return docs.map(LevelMapper.toDomain);
  }

  async findByXp(xp: number): Promise<Level | null> {
    const doc = await this._model.findOne({
      minXp: { $lte: xp },
      maxXp: { $gte: xp }
    }).exec();

    return doc ? LevelMapper.toDomain(doc) : null;
  }

  async findByLevelNumber(levelNumber: number): Promise<Level | null> {
    const doc = await this._model.findOne({ levelNumber }).exec();
    return doc ? LevelMapper.toDomain(doc) : null;
  }

  async findById(id: string): Promise<Level | null> {
    const doc = await this.findByIdRaw(id);
    return doc ? LevelMapper.toDomain(doc) : null;
  }

  async create(level: Level): Promise<Level> {
    const created = await this.createRaw(
      LevelMapper.toPersistence(level)
    );

    return LevelMapper.toDomain(created);
  }

  async updateEntity(level: Level): Promise<Level> {
    const updated = await this.updateRaw(
      level.id!,
      LevelMapper.toPersistence(level)
    );

    return LevelMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.deleteByIdRaw(id);
    return true;
  }
}