import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";


export class GetChallengeByIdUseCase {
  constructor(
    private readonly challengeRepo: IChallengeRepository
  ) {}

  async execute(id: string): Promise<Challenge | null> {
    if (!id) {
      throw new Error("CHALLENGE_ID_REQUIRED");
    }

    return this.challengeRepo.findByIdForUser(id);
  }
}


