import { ChallengeCodeTemplate } from "../../entities/challenge/ChallengeCodeTemplate";


export interface IChallengeCodeTemplateRepository {
  createMany(
    challengeId: string,
    templates: Omit<ChallengeCodeTemplate, "id" | "challengeId">[]
  ): Promise<void>;

  findByChallenge(challengeId: string): Promise<ChallengeCodeTemplate[]>;

  findSolution(
    challengeId: string,
    language: string
  ): Promise<ChallengeCodeTemplate | null>;
}
