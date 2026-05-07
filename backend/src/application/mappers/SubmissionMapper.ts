import { Types } from "mongoose";
import { Submission } from "../../domain/entities/submission/Submission";
import { ISubmissionDoc } from "../../infrastructure/database/models/submission/SubmissionModel";
import { ILeaderboardEntry } from "../../domain/repositories/submission/ISubmissionRepository";

export interface ILeaderboardItem {
  user: {
    _id: { toString(): string };
    username: string;
    avatar?: string;
    [key: string]: unknown; // To support other user fields spread into DTO
  };
  xp: number;
  challengesSolved: number;
}

export class SubmissionMapper {
  static toDomain(doc: ISubmissionDoc): Submission {
    return new Submission(
      doc._id.toString(),
      doc.userId.toString(),
      doc.challengeId.toString(),
      doc.language,
      doc.code,
      doc.finalStatus,
      doc.runtime,
      doc.memory,
      doc.xpEarned,
      doc.submittedAt
    );
  }

  static toPersistence(entity: Partial<Submission>): Partial<ISubmissionDoc> {
    const persistence: Partial<ISubmissionDoc> = {};
    if (entity.userId !== undefined) persistence.userId = new Types.ObjectId(entity.userId); // Cast for ObjectId conversion
    if (entity.challengeId !== undefined) persistence.challengeId = new Types.ObjectId(entity.challengeId);
    if (entity.language !== undefined) persistence.language = entity.language;
    if (entity.code !== undefined) persistence.code = entity.code;
    if (entity.finalStatus !== undefined) persistence.finalStatus = entity.finalStatus;
    if (entity.runtime !== undefined) persistence.runtime = entity.runtime;
    if (entity.memory !== undefined) persistence.memory = entity.memory;
    if (entity.xpEarned !== undefined) persistence.xpEarned = entity.xpEarned;
    return persistence;
  }

  static toLeaderboardDTO(item: ILeaderboardItem): ILeaderboardEntry {
    const { user, xp, challengesSolved } = item;
    return {
      ...user,
      id: user._id.toString(),
      username: user.username,
      xp: xp,
      challengesSolved: challengesSolved,
    };
  }
}
