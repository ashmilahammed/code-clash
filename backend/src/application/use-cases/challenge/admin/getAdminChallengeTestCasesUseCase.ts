import { IChallengeTestCaseRepository } from "../../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ChallengeTestCase } from "../../../../domain/entities/challenge/ChallengeTestCase";

export class GetAdminChallengeTestCasesUseCase {
    constructor(
        private readonly testCaseRepo: IChallengeTestCaseRepository
    ) { }

    async execute(challengeId: string): Promise<ChallengeTestCase[]> {
        if (!challengeId) {
            throw new Error("CHALLENGE_ID_REQUIRED");
        }

        return await this.testCaseRepo.findByChallenge(challengeId);
    }
}
