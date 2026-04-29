import { ChallengeCodeTemplate } from "../../../../domain/entities/challenge/ChallengeCodeTemplate";

export interface IAddChallengeCodeTemplatesUseCase {
  execute(
    challengeId: string,
    templates: Omit<ChallengeCodeTemplate, "id" | "challengeId">[]
  ): Promise<void>;
}
