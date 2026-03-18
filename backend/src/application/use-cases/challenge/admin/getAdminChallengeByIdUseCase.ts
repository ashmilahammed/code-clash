import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";

export class GetAdminChallengeByIdUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(id: string): Promise<Challenge | null> {
    if (!id) {
      throw new Error("CHALLENGE_ID_REQUIRED");
    }

    return this._challengeRepo.findById(id);
  }
}
