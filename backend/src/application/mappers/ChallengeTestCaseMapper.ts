import { ChallengeTestCase } from "../../domain/entities/challenge/ChallengeTestCase";
import { IChallengeTestCaseDoc } from "../../infrastructure/database/models/challenge/ChallengeTestCaseModel";


export class ChallengeTestCaseMapper {

  static toDomain(doc: IChallengeTestCaseDoc): ChallengeTestCase {
    return new ChallengeTestCase(
      doc._id.toString(),
      doc.challengeId.toString(),
      doc.input,
      doc.expectedOutput,
      doc.isSample
    );
  }

  static toPersistence(
    entity: Omit<ChallengeTestCase, "id">
  ) {
    return {
      challengeId: entity.challengeId,
      input: entity.input,
      expectedOutput: entity.expectedOutput,
      isSample: entity.isSample,
    };
  }
}
