import { Submission } from "../../domain/entities/submission/Submission";
import { ISubmissionDoc } from "../../infrastructure/database/models/submission/SubmissionModel";

export class SubmissionMapper {
  static toDomain(doc: ISubmissionDoc | any): Submission {
    return new Submission(
      doc._id?.toString() || doc.id,
      doc.userId?.toString(),
      doc.challengeId?.toString(),
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
    const persistence: any = {};
    if (entity.userId !== undefined) persistence.userId = entity.userId;
    if (entity.challengeId !== undefined) persistence.challengeId = entity.challengeId;
    if (entity.language !== undefined) persistence.language = entity.language;
    if (entity.code !== undefined) persistence.code = entity.code;
    if (entity.finalStatus !== undefined) persistence.finalStatus = entity.finalStatus;
    if (entity.runtime !== undefined) persistence.runtime = entity.runtime;
    if (entity.memory !== undefined) persistence.memory = entity.memory;
    if (entity.xpEarned !== undefined) persistence.xpEarned = entity.xpEarned;
    return persistence as Partial<ISubmissionDoc>;
  }

  static toLeaderboardDTO(item: any): any {
    return {
      ...item.user,
      id: item.user?._id?.toString(),
      xp: item.xp,
      challengesSolved: item.challengesSolved,
    };
  }
}
