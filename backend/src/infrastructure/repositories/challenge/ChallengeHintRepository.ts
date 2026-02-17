// import { IChallengeHintRepository } from "../../../domain/repositories/challenge/IChallengeHintRepository";
// import {
//     ChallengeHintModel,
//     // IChallengeHintDoc,
// } from "../../database/models/challenge/ChallengeHintModel";
// import { IChallengeHint } from "../../../domain/entities/challenge/ChallengeHint";


// export class ChallengeHintRepository
//     implements IChallengeHintRepository {

//     async createMany(
//         challengeId: string,
//         hints: Omit<IChallengeHint, "id" | "challengeId">[]
//     ): Promise<void> {
//         await ChallengeHintModel.insertMany(
//             hints.map((h) => ({
//                 ...h,
//                 challengeId,
//             }))
//         );
//     }


//     async findByChallenge(
//         challengeId: string
//     ): Promise<IChallengeHint[]> {
//         const docs = await ChallengeHintModel
//             .find({ challengeId })
//             .sort({ order: 1 });


//         return docs.map((d) => {
//             const hint = {
//                 id: d._id.toString(),
//                 challengeId: d.challengeId.toString(),
//                 order: d.order,
//                 content: d.content,
//             } as IChallengeHint;

//             if (d.unlockAfterMinutes !== undefined) {
//                 hint.unlockAfterMinutes = d.unlockAfterMinutes;
//             }

//             return hint;
//         });

//     }
// }





import { IChallengeHintRepository } from "../../../domain/repositories/challenge/IChallengeHintRepository";
import { ChallengeHintModel } from "../../database/models/challenge/ChallengeHintModel";
import { ChallengeHint } from "../../../domain/entities/challenge/ChallengeHint";
import { ChallengeHintMapper } from "../../../application/mappers/ChallengeHintMapper";



export class ChallengeHintRepository
  implements IChallengeHintRepository {

  async createMany(
    challengeId: string,
    hints: Omit<ChallengeHint, "id" | "challengeId">[]
  ): Promise<void> {

    // Replace existing hints
    await ChallengeHintModel.deleteMany({ challengeId });

    if (hints.length > 0) {
      await ChallengeHintModel.insertMany(
        hints.map((h) =>
          ChallengeHintMapper.toPersistence({
            ...h,
            challengeId,
          })
        )
      );
    }
  }


  async findByChallenge(
    challengeId: string
  ): Promise<ChallengeHint[]> {

    const docs = await ChallengeHintModel
      .find({ challengeId })
      .sort({ order: 1 });

    return docs.map(ChallengeHintMapper.toDomain);
  }
}
