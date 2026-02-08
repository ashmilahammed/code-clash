import { IChallengeCodeTemplate } from "../entities/ChallengeCodeTemplate";


export interface IChallengeCodeTemplateRepository {
  createMany(
    challengeId: string,
    templates: Omit<IChallengeCodeTemplate, "id" | "challengeId">[]
  ): Promise<void>;

  findByChallenge(challengeId: string): Promise<IChallengeCodeTemplate[]>;

  findSolution(
    challengeId: string,
    language: string
  ): Promise<IChallengeCodeTemplate | null>;
}
