import { IChallengeHint } from "../entities/ChallengeHint";

export interface IChallengeHintRepository {
  createMany(
    challengeId: string,
    hints: Omit<IChallengeHint, "id" | "challengeId">[]
  ): Promise<void>;

  findByChallenge(challengeId: string): Promise<IChallengeHint[]>;
}

