import { IChallengeTestCaseRepository } from "../../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ChallengeTestCase } from "../../../../domain/entities/challenge/ChallengeTestCase";
import { IGetAdminChallengeTestCasesUseCase } from "../../../interfaces/challenge/admin/IGetAdminChallengeTestCasesUseCase";


export class GetAdminChallengeTestCasesUseCase implements IGetAdminChallengeTestCasesUseCase {
    constructor(
        private readonly _testCaseRepo: IChallengeTestCaseRepository
    ) { }

    async execute(challengeId: string): Promise<ChallengeTestCase[]> {
        if (!challengeId) {
            throw new Error("CHALLENGE_ID_REQUIRED");
        }

        return await this._testCaseRepo.findByChallenge(challengeId);
    }
}
