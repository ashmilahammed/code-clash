import { IChallengeTestCaseRepository } from "../../../../domain/repositories/challenge/IChallengeTestCaseRepository";


export class AddChallengeTestCasesUseCase {
    constructor(
        private readonly _repo: IChallengeTestCaseRepository
    ) { }

    async execute(
        challengeId: string,
        cases: {
            input: string;
            expectedOutput: string;
            isSample?: boolean;
        }[]
    ): Promise<void> {

        //
        if (!cases.length) {
            throw new Error("TEST_CASES_REQUIRED");
        }

        const hasSample = cases.some(c => c.isSample);
        if (!hasSample) {
            throw new Error("AT_LEAST_ONE_SAMPLE_REQUIRED");
        }

        for (const c of cases) {
            if (!c.input.trim() || !c.expectedOutput.trim()) {
                throw new Error("TEST_CASE_INVALID");
            }
        }

        //
        const normalizedCases = cases.map((c) => ({
            input: c.input,
            expectedOutput: c.expectedOutput,
            isSample: c.isSample ?? false, // ensure boolean
        }));

        await this._repo.createMany(challengeId, normalizedCases);
    }
}
