import { Types } from "mongoose";
import { ChallengeTestCaseModel } from "../../database/models/challenge/ChallengeTestCaseModel";
import { IChallengeTestCaseRepository } from "../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ChallengeTestCase } from "../../../domain/entities/challenge/ChallengeTestCase";
import { ChallengeTestCaseMapper } from "../../../application/mappers/ChallengeTestCaseMapper";



export class ChallengeTestCaseRepository
  implements IChallengeTestCaseRepository {

  async createMany(
    challengeId: string,
    cases: Omit<ChallengeTestCase, "id" | "challengeId">[]
  ): Promise<void> {

    // Replace existing test cases
    await ChallengeTestCaseModel.deleteMany({ challengeId });

    if (cases.length > 0) {
      await ChallengeTestCaseModel.insertMany(
        cases.map((c) =>
          ChallengeTestCaseMapper.toPersistence({
            ...c,
            challengeId,
          })
        )
      );
    }
  }

  async findByChallenge(
    challengeId: string
  ): Promise<ChallengeTestCase[]> {

    const docs = await ChallengeTestCaseModel.find({
      challengeId: new Types.ObjectId(challengeId),
    });

    return docs.map(ChallengeTestCaseMapper.toDomain);
  }
}
