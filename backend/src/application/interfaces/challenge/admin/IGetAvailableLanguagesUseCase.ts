import { ProgrammingLanguage } from "../../../../domain/entities/language/ProgrammingLanguage";

export interface IGetAvailableLanguagesUseCase {
  execute(): Promise<ProgrammingLanguage[]>;
}
