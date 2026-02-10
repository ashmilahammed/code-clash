import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { IProgrammingLanguageRepository } from "../../../../domain/repositories/language/IProgrammingLanguageRepository";


export class AddChallengeLanguagesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _langRepo: IProgrammingLanguageRepository
  ) {}

  async execute(challengeId: string, keys: string[]) {
    const languageIds = await this._langRepo.findByKeys(keys);
    await this._challengeRepo.addLanguages(challengeId, languageIds);
  }
}
