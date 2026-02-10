// import { IProgrammingLanguageRepository } from "../../../domain/repositories/language/IProgrammingLanguageRepository";
// import { ProgrammingLanguageModel } from "../../database/models/language/ProgrammingLanguageModel";


// export class ProgrammingLanguageRepository
//   implements IProgrammingLanguageRepository {

//   async findAllActive() {
//     return ProgrammingLanguageModel.find({ isActive: true });
//   }

//   async findByKeys(keys: string[]): Promise<string[]> {
//     const normalizedKeys = keys.map((k) => k.toLowerCase());

//     const langs = await ProgrammingLanguageModel.find({
//       key: { $in: normalizedKeys },
//     });

//     return langs.map((l) => l._id.toString());
//   }
// }




import { ProgrammingLanguageModel } from "../../database/models/language/ProgrammingLanguageModel";
import { IProgrammingLanguageRepository } from "../../../domain/repositories/language/IProgrammingLanguageRepository";
import { ProgrammingLanguage } from "../../../domain/entities/language/ProgrammingLanguage";
import { ProgrammingLanguageMapper } from "../../../application/mappers/ProgrammingLanguageMapper";


export class ProgrammingLanguageRepository
  implements IProgrammingLanguageRepository {

  async findAllActive(): Promise<ProgrammingLanguage[]> {
    const docs = await ProgrammingLanguageModel.find({ isActive: true });
    return docs.map(ProgrammingLanguageMapper.toDomain);
  }

  
  async findByKeys(keys: string[]): Promise<string[]> {
    const docs = await ProgrammingLanguageModel.find({
      key: { $in: keys },
      isActive: true,
    }).select("_id");

    return docs.map((d) => d._id.toString());
  }
}
