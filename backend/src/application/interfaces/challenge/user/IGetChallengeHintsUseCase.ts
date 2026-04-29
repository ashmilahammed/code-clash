import { ChallengeHint } from "../../../../domain/entities/challenge/ChallengeHint";

export interface IGetChallengeHintsUseCase {
  execute(challengeId: string): Promise<ChallengeHint[]>;
}
