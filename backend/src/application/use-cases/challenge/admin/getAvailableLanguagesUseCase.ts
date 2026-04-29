import { IProgrammingLanguageRepository } from "../../../../domain/repositories/language/IProgrammingLanguageRepository";
import { IGetAvailableLanguagesUseCase } from "../../../interfaces/challenge/admin/IGetAvailableLanguagesUseCase";


export class GetAvailableLanguagesUseCase implements IGetAvailableLanguagesUseCase {
  constructor(
    private readonly _langRepo: IProgrammingLanguageRepository
  ) {}

  async execute() {
    return this._langRepo.findAllActive();
  }
}


