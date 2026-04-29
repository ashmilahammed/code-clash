import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { IGetChallengeLanguagesUseCase } from "../../../interfaces/challenge/user/IGetChallengeLanguagesUseCase";


export class GetChallengeLanguagesUseCase implements IGetChallengeLanguagesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(challengeId: string): Promise<string[]> {
    const challenge = await this._challengeRepo.findByIdWithLanguages(challengeId);

    if (!challenge) {
      throw new Error("CHALLENGE_NOT_FOUND");
    }

    return challenge.languages.map((l) => l.key);
  }
}


