// import { IChallengeHint } from "../../entities/challenge/ChallengeHint";
import { ChallengeHint } from "../../entities/challenge/ChallengeHint";

export interface IChallengeHintRepository {
  createMany(
    challengeId: string,
    hints: Omit<ChallengeHint, "id" | "challengeId">[]
  ): Promise<void>;

  findByChallenge(challengeId: string): Promise<ChallengeHint[]>;
}

