import { IChallengeTestCaseRepository } from "../../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ChallengeTestCase } from "../../../../domain/entities/challenge/ChallengeTestCase";

export class GetChallengeTestCasesUseCase {
    constructor(
        private readonly testCaseRepo: IChallengeTestCaseRepository
    ) { }

    async execute(challengeId: string): Promise<ChallengeTestCase[]> {
        if (!challengeId) {
            throw new Error("CHALLENGE_ID_REQUIRED");
        }

        const allTestCases = await this.testCaseRepo.findByChallenge(challengeId);

        // Only return sample test cases to the user
        return allTestCases.filter(tc => tc.isSample);
    }
}
