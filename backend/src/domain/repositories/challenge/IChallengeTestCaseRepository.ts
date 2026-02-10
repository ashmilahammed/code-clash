// import { IChallengeTestCase } from "../../entities/challenge/ChallengeTestCase";
import { ChallengeTestCase } from "../../entities/challenge/ChallengeTestCase";

export interface IChallengeTestCaseRepository {
  
  createMany(
    challengeId: string,
    cases: Omit<ChallengeTestCase, "id" | "challengeId">[]
  ): Promise<void>;

  findByChallenge(challengeId: string): Promise<ChallengeTestCase[]>;
}
