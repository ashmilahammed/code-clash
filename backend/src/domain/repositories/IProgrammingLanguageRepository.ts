import { IProgrammingLanguage } from "../entities/ProgrammingLanguage";


export interface IProgrammingLanguageRepository {
  findAllActive(): Promise<IProgrammingLanguage[]>;
  findByKeys(keys: string[]): Promise<string[]>;
}
