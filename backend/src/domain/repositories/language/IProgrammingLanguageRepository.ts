import { ProgrammingLanguage } from "../../entities/language/ProgrammingLanguage";

export interface IProgrammingLanguageRepository {
  findAllActive(): Promise<ProgrammingLanguage[]>;
  findByKeys(keys: string[]): Promise<string[]>;
}
