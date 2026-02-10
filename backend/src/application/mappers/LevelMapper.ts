import { Types } from "mongoose";
import { Level } from "../../domain/entities/level/Level";
import { ILevelDoc } from "../../infrastructure/database/models/level/LevelModel";

export class LevelMapper {

  static toDomain(doc: ILevelDoc): Level {
    return new Level(
      doc._id.toString(),  
      doc.levelNumber,
      doc.minXp,
      doc.maxXp,
      doc.badgeId ? doc.badgeId.toString() : undefined,
      doc.title ?? undefined,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toPersistence(level: Level) {
    return {
      levelNumber: level.levelNumber,
      minXp: level.minXp,
      maxXp: level.maxXp,
      title: level.title ?? null,
      badgeId: level.badgeId
        ? new Types.ObjectId(level.badgeId)
        : null
    };
  }
}
