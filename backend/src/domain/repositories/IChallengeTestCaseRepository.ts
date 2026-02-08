import { IChallengeTestCase } from "../entities/ChallengeTestCase";

export interface IChallengeTestCaseRepository {
  createMany(
    challengeId: string,
    cases: Omit<IChallengeTestCase, "id" | "challengeId">[]
  ): Promise<void>;

  findByChallenge(challengeId: string): Promise<IChallengeTestCase[]>;
}
