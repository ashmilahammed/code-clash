// import { Types } from "mongoose";
// import { ChallengeCodeTemplateModel } from "../../database/models/challenge/ChallengeCodeTemplateModel";
// import { IChallengeCodeTemplateRepository } from "../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";
// import { IChallengeCodeTemplate } from "../../../domain/entities/challenge/ChallengeCodeTemplate";


// export class ChallengeCodeTemplateRepository
//   implements IChallengeCodeTemplateRepository {

//   async createMany(
//     challengeId: string,
//     templates: Omit<IChallengeCodeTemplate, "id" | "challengeId">[]
//   ): Promise<void> {
//     await ChallengeCodeTemplateModel.insertMany(
//       templates.map((t) => ({
//         ...t,
//         challengeId: new Types.ObjectId(challengeId),
//       }))
//     );
//   }


//   async findByChallenge(
//     challengeId: string
//   ): Promise<IChallengeCodeTemplate[]> {
//     const docs = await ChallengeCodeTemplateModel.find({
//       challengeId,
//     });

//     return docs.map((d) => ({
//       id: d._id.toString(),
//       challengeId: d.challengeId.toString(),
//       language: d.language as any,
//       starterCode: d.starterCode,
//       solutionCode: d.solutionCode,
//     }));
//   }


//   async findSolution(
//     challengeId: string,
//     language: string
//   ): Promise<IChallengeCodeTemplate | null> {
//     const doc = await ChallengeCodeTemplateModel.findOne({
//       challengeId,
//       language,
//     });

//     if (!doc) return null;

//     return {
//       id: doc._id.toString(),
//       challengeId: doc.challengeId.toString(),
//       language: doc.language as any,
//       starterCode: doc.starterCode,
//       solutionCode: doc.solutionCode,
//     };
//   }
// }






// import { Types } from "mongoose";
import { ChallengeCodeTemplateModel } from "../../database/models/challenge/ChallengeCodeTemplateModel";
import { IChallengeCodeTemplateRepository } from "../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";
import { ChallengeCodeTemplate } from "../../../domain/entities/challenge/ChallengeCodeTemplate";
import { ChallengeCodeTemplateMapper } from "../../../application/mappers/ChallengeCodeTemplateMapper";


export class ChallengeCodeTemplateRepository
  implements IChallengeCodeTemplateRepository {

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
