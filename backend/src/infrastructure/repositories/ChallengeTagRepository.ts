import { ChallengeTagModel } from "../database/models/ChallengeTagModel";
import { IChallengeTagRepository } from "../../domain/repositories/IChallengeTagRepository";



export class ChallengeTagRepository implements IChallengeTagRepository {
  async findOrCreate(name: string): Promise<string> {
    const tag = await ChallengeTagModel.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true }
    );

    return tag._id.toString();
  }
}
