import { IChallengeTestCaseRepository } from "../../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ChallengeTestCase } from "../../../../domain/entities/challenge/ChallengeTestCase";

import { IGetChallengeTestCasesUseCase } from "../../../interfaces/challenge/user/IGetChallengeTestCasesUseCase";


export class GetChallengeTestCasesUseCase implements IGetChallengeTestCasesUseCase {
    constructor(
        private readonly _testCaseRepo: IChallengeTestCaseRepository
    ) { }

    async execute(challengeId: string): Promise<ChallengeTestCase[]> {
        if (!challengeId) {
            throw new Error("CHALLENGE_ID_REQUIRED");
        }

        const allTestCases = await this._testCaseRepo.findByChallenge(challengeId);

        // Only return sample test cases to the user
        return allTestCases.filter(tc => tc.isSample);
    }
}
