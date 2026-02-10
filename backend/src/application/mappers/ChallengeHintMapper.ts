import { ChallengeHint } from "../../domain/entities/challenge/ChallengeHint";
import { IChallengeHintDoc } from "../../infrastructure/database/models/challenge/ChallengeHintModel";


export class ChallengeHintMapper {

  static toDomain(doc: IChallengeHintDoc): ChallengeHint {
    return new ChallengeHint(
      doc._id.toString(),
      doc.challengeId.toString(),
      doc.order,
      doc.content,
      doc.unlockAfterMinutes
    );
  }

  static toPersistence(
    entity: Omit<ChallengeHint, "id">
  ) {
    return {
      challengeId: entity.challengeId,
      order: entity.order,
      content: entity.content,
      unlockAfterMinutes: entity.unlockAfterMinutes,
    };
  }
}
