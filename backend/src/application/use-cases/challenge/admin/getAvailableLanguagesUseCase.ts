import { IProgrammingLanguageRepository } from "../../../../domain/repositories/language/IProgrammingLanguageRepository";


export class GetAvailableLanguagesUseCase {
  constructor(
    private readonly _langRepo: IProgrammingLanguageRepository
  ) {}

  async execute() {
    return this._langRepo.findAllActive();
  }
}


