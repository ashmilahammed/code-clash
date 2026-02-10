import { ChallengeCodeTemplate } from "../../domain/entities/challenge/ChallengeCodeTemplate";
import { IChallengeCodeTemplateDoc } from "../../infrastructure/database/models/challenge/ChallengeCodeTemplateModel";


export class ChallengeCodeTemplateMapper {

  static toDomain(doc: IChallengeCodeTemplateDoc): ChallengeCodeTemplate {
    return new ChallengeCodeTemplate(
      doc._id.toString(),
      doc.challengeId.toString(),
      doc.language,
      doc.starterCode,
      doc.solutionCode
    );
  }

  static toPersistence(
    entity: Omit<ChallengeCodeTemplate, "id">
  ) {
    return {
      challengeId: entity.challengeId,
      language: entity.language,
      starterCode: entity.starterCode,
      solutionCode: entity.solutionCode,
    };
  }
}