import { Types } from "mongoose";
import { ChallengeTestCaseModel } from "../database/models/ChallengeTestCaseModel";
import { IChallengeTestCaseRepository } from "../../domain/repositories/IChallengeTestCaseRepository";
import { IChallengeTestCase } from "../../domain/entities/ChallengeTestCase";



export class ChallengeTestCaseRepository
  implements IChallengeTestCaseRepository {

  async createMany(
    challengeId: string,
    cases: Omit<IChallengeTestCase, "id" | "challengeId">[]
  ): Promise<void> {
    await ChallengeTestCaseModel.insertMany(
      cases.map((c) => ({
        ...c,
        challengeId: new Types.ObjectId(challengeId),
      }))
    );
  }

  async findByChallenge(
    challengeId: string
  ): Promise<IChallengeTestCase[]> {
    const docs = await ChallengeTestCaseModel.find({
      challengeId: new Types.ObjectId(challengeId),
    });

    return docs.map((d) => ({
      id: d._id.toString(),
      challengeId: d.challengeId.toString(),
      input: d.input,
      expectedOutput: d.expectedOutput,
      isSample: d.isSample,
    }));
  }
}

