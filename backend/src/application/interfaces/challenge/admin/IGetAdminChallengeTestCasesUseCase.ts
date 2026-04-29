import { ChallengeTestCase } from "../../../../domain/entities/challenge/ChallengeTestCase";

export interface IGetAdminChallengeTestCasesUseCase {
  execute(challengeId: string): Promise<ChallengeTestCase[]>;
}
