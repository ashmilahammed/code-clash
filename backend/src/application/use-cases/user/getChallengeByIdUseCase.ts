import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
import { IChallenge } from "../../../domain/entities/Challenge";

export class GetChallengeByIdUseCase {
  constructor(
    private readonly challengeRepo: IChallengeRepository
  ) {}

  async execute(id: string): Promise<IChallenge | null> {
    if (!id) {
      throw new Error("CHALLENGE_ID_REQUIRED");
    }

    return this.challengeRepo.findByIdForUser(id);
  }
}


