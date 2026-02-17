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
