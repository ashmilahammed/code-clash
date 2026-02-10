// import { Types } from "mongoose";
// import { ChallengeTestCaseModel } from "../../database/models/challenge/ChallengeTestCaseModel";
// import { IChallengeTestCaseRepository } from "../../../domain/repositories/challenge/IChallengeTestCaseRepository";
// import { IChallengeTestCase } from "../../../domain/entities/challenge/ChallengeTestCase";



// export class ChallengeTestCaseRepository
//   implements IChallengeTestCaseRepository {

//   async createMany(
//     challengeId: string,
//     cases: Omit<IChallengeTestCase, "id" | "challengeId">[]
//   ): Promise<void> {
//     await ChallengeTestCaseModel.insertMany(
//       cases.map((c) => ({
//         ...c,
//         challengeId: new Types.ObjectId(challengeId),
//       }))
//     );
//   }

//   async findByChallenge(
//     challengeId: string
//   ): Promise<IChallengeTestCase[]> {
//     const docs = await ChallengeTestCaseModel.find({
//       challengeId: new Types.ObjectId(challengeId),
//     });

//     return docs.map((d) => ({
//       id: d._id.toString(),
//       challengeId: d.challengeId.toString(),
//       input: d.input,
//       expectedOutput: d.expectedOutput,
//       isSample: d.isSample,
//     }));
//   }
// }





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

    await ChallengeTestCaseModel.insertMany(
      cases.map((c) =>
        ChallengeTestCaseMapper.toPersistence({
          ...c,
          challengeId,
        })
      )
    );
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
