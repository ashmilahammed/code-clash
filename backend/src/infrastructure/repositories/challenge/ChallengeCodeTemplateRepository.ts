import { ChallengeCodeTemplateModel } from "../../database/models/challenge/ChallengeCodeTemplateModel";
import { IChallengeCodeTemplateRepository } from "../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";
import { ChallengeCodeTemplate } from "../../../domain/entities/challenge/ChallengeCodeTemplate";
import { ChallengeCodeTemplateMapper } from "../../../application/mappers/ChallengeCodeTemplateMapper";


export class ChallengeCodeTemplateRepository implements IChallengeCodeTemplateRepository {

  async createMany(
    challengeId: string,
    templates: Omit<ChallengeCodeTemplate, "id" | "challengeId">[]
  ): Promise<void> {

    // Replace existing templates
    await ChallengeCodeTemplateModel.deleteMany({ challengeId });

    if (templates.length > 0) {
      await ChallengeCodeTemplateModel.insertMany(
        templates.map((t) =>
          ChallengeCodeTemplateMapper.toPersistence({
            ...t,
            challengeId,
          })
        )
      );
    }
  }


  async findByChallenge(
    challengeId: string
  ): Promise<ChallengeCodeTemplate[]> {

    const docs = await ChallengeCodeTemplateModel.find({ challengeId });

    return docs.map(ChallengeCodeTemplateMapper.toDomain);
  }


  async findSolution(
    challengeId: string,
    language: string
  ): Promise<ChallengeCodeTemplate | null> {

    const doc = await ChallengeCodeTemplateModel.findOne({
      challengeId,
      language,
    });

    if (!doc) return null;

    return ChallengeCodeTemplateMapper.toDomain(doc);
  }
}


