// import { ChallengeTagModel } from "../../database/models/challenge/ChallengeTagModel";
// import { IChallengeTagRepository } from "../../../domain/repositories/challenge/IChallengeTagRepository";



// export class ChallengeTagRepository implements IChallengeTagRepository {
//   async findOrCreate(name: string): Promise<string> {
//     const tag = await ChallengeTagModel.findOneAndUpdate(
//       { name },
//       { name },
//       { upsert: true, new: true }
//     );

//     return tag._id.toString();
//   }
// }


import { ChallengeTagModel } from "../../database/models/challenge/ChallengeTagModel";
import { IChallengeTagRepository } from "../../../domain/repositories/challenge/IChallengeTagRepository";
import { ChallengeTag } from "../../../domain/entities/challenge/ChallengeTag";


export class ChallengeTagRepository implements IChallengeTagRepository {

  async findOrCreate(name: string): Promise<ChallengeTag> {
    const normalized = name.trim().toLowerCase();

    const doc = await ChallengeTagModel.findOneAndUpdate(
      { name: normalized },
      { name: normalized },
      { upsert: true, new: true }
    );

    return new ChallengeTag(
      doc._id.toString(),
      doc.name
    );
  }
}
