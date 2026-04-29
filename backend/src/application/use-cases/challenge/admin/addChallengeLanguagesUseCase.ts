import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { IProgrammingLanguageRepository } from "../../../../domain/repositories/language/IProgrammingLanguageRepository";
import { IAddChallengeLanguagesUseCase } from "../../../interfaces/challenge/admin/IAddChallengeLanguagesUseCase";

export class AddChallengeLanguagesUseCase implements IAddChallengeLanguagesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _langRepo: IProgrammingLanguageRepository
  ) {}

  async execute(challengeId: string, keys: string[]) {
    const languageIds = await this._langRepo.findByKeys(keys);
    await this._challengeRepo.addLanguages(challengeId, languageIds);
  }
}
