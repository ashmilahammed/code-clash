import { ChallengeTestCase } from "../../../../domain/entities/challenge/ChallengeTestCase";

export interface IGetChallengeTestCasesUseCase {
  execute(challengeId: string): Promise<ChallengeTestCase[]>;
}
