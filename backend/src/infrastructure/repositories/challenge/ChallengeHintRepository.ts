import { IChallengeHintRepository } from "../../../domain/repositories/challenge/IChallengeHintRepository";
import { ChallengeHintModel } from "../../database/models/challenge/ChallengeHintModel";
import { ChallengeHint } from "../../../domain/entities/challenge/ChallengeHint";
import { ChallengeHintMapper } from "../../../application/mappers/ChallengeHintMapper";



export class ChallengeHintRepository implements IChallengeHintRepository {

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

