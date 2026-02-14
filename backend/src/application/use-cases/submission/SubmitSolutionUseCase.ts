import { IChallengeRepository } from "../../../domain/repositories/challenge/IChallengeRepository";
import { IChallengeTestCaseRepository } from "../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ISubmissionRepository } from "../../../domain/repositories/submission/ISubmissionRepository";
import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";
import { Submission } from "../../../domain/entities/submission/Submission";


export class SubmitSolutionUseCase {
    constructor(
        private readonly challengeRepo: IChallengeRepository,
        private readonly testCaseRepo: IChallengeTestCaseRepository,
        private readonly submissionRepo: ISubmissionRepository,
        private readonly executionService: ICodeExecutionService
    ) { }



    async execute(params: {
        userId: string;
        challengeId: string;
        language: string;
        code: string;
    }) {
        const { userId, challengeId, language, code } = params;

        // Get challenge (for XP)
        const challenge = await this.challengeRepo.findByIdForUser(
            challengeId
        );

        if (!challenge) {
            throw new Error("Challenge not found");
        }


        const challengeWithLang =
            await this.challengeRepo.findByIdWithLanguages(challengeId);

        if (
            !challengeWithLang?.languages.some(
                (l) => l.key === language
            )
        ) {
            throw new Error("Language not allowed for this challenge");
        }



        // Get all test cases
        const testCases =
            await this.testCaseRepo.findByChallenge(challengeId);

        const hiddenCases = testCases.filter(
            (tc) => !tc.isSample
        );

        if (hiddenCases.length === 0) {
            throw new Error("No hidden test cases configured");
        }

        let finalStatus: "PASSED" | "FAILED" | "ERROR" = "PASSED";
        let maxRuntime = 0;
        let memoryUsed = 0;

        // Execute against each hidden test case
        for (const testCase of hiddenCases) {
            const result = await this.executionService.execute(
                language,
                code,
                testCase.input
            );

            if (result.stderr && result.stderr.length > 0) {
                finalStatus = "ERROR";
                break;
            }


            // Normalize helper
            const normalize = (str: string) =>
                str.replace(/\r\n/g, "\n").trim();

            const normalizedOutput = normalize(result.stdout);
            const expectedOutput = normalize(testCase.expectedOutput);

            // const normalizedOutput = result.stdout.trim();
            // const expectedOutput = testCase.expectedOutput.trim();

            if (normalizedOutput !== expectedOutput) {
                finalStatus = "FAILED";
                break;
            }

            if (result.runtime > maxRuntime) {
                maxRuntime = result.runtime;
            }

            // memoryUsed = result.memory;
            if (result.memory > memoryUsed) {
                memoryUsed = result.memory;
            }

        }

        // Check first solve
        const alreadySolved =
            await this.submissionRepo.hasUserSolvedChallenge(
                userId,
                challengeId
            );

        const xpEarned =
            finalStatus === "PASSED" && !alreadySolved
                ? challenge.xpReward
                : 0;

        //  Save submission
        const submission = new Submission(
            undefined,
            userId,
            challengeId,
            language,
            code,
            finalStatus,
            maxRuntime,
            memoryUsed,
            xpEarned
        );

        const saved = await this.submissionRepo.create(submission);

        return {
            status: finalStatus,
            runtime: maxRuntime,
            memory: memoryUsed,
            xpEarned,
        };
    }
}
