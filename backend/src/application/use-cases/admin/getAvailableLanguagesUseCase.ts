import { IProgrammingLanguageRepository } from "../../../domain/repositories/IProgrammingLanguageRepository";


export class GetAvailableLanguagesUseCase {
  constructor(
    private readonly _langRepo: IProgrammingLanguageRepository
  ) {}

  async execute() {
    return this._langRepo.findAllActive();
  }
}


// async execute(): Promise<IProgrammingLanguage[]> {
//   return this._langRepo.findAllActive();
// }

