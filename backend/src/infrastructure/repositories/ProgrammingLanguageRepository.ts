// export class ProgrammingLanguageRepository
//   implements IProgrammingLanguageRepository {

//   async findAllActive() {
//     return ProgrammingLanguageModel.find({ isActive: true });
//   }

//   async findByKeys(keys: string[]): Promise<string[]> {
//     const langs = await ProgrammingLanguageModel.find({
//       key: { $in: keys },
//     });

//     return langs.map((l) => l._id.toString());
//   }
// }


import { IProgrammingLanguageRepository } from "../../domain/repositories/IProgrammingLanguageRepository";
import { ProgrammingLanguageModel } from "../database/models/ProgrammingLanguageModel";


export class ProgrammingLanguageRepository
  implements IProgrammingLanguageRepository {

  async findAllActive() {
    return ProgrammingLanguageModel.find({ isActive: true });
  }

  async findByKeys(keys: string[]): Promise<string[]> {
    const normalizedKeys = keys.map((k) => k.toLowerCase());

    const langs = await ProgrammingLanguageModel.find({
      key: { $in: normalizedKeys },
    });

    return langs.map((l) => l._id.toString());
  }
}
