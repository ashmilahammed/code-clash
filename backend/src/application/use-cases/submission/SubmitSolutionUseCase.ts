import { IChallengeRepository } from "../../../domain/repositories/challenge/IChallengeRepository";
import { IChallengeTestCaseRepository } from "../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ISubmissionRepository } from "../../../domain/repositories/submission/ISubmissionRepository";
import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";
import { Submission } from "../../../domain/entities/submission/Submission";

import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { ILevelCalculator } from "../../../domain/services/ILevelCalculator";

export class SubmitSolutionUseCase {
    constructor(
        private readonly challengeRepo: IChallengeRepository,
        private readonly testCaseRepo: IChallengeTestCaseRepository,
        private readonly submissionRepo: ISubmissionRepository,
        private readonly executionService: ICodeExecutionService,

        private readonly userRepo: IUserRepository,
        private readonly levelCalculator: ILevelCalculator

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


        // Check allowed language
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

        let hiddenCases = testCases.filter(
            (tc) => !tc.isSample
        );

        // Fallback: If no hidden cases, use sample cases (for testing purposes)
        if (hiddenCases.length === 0) {
            // throw new Error("No hidden test cases configured");
            hiddenCases = testCases;
        }

        if (hiddenCases.length === 0) {
            throw new Error("No test cases found for this challenge");
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

        // const saved = await this.submissionRepo.create(submission);
        await this.submissionRepo.create(submission);


        // XP + Level 
        if (xpEarned > 0) {

            await this.userRepo.addXp(userId, xpEarned);

            // Reload user to get updated XP
            const updatedUser = await this.userRepo.findById(userId);
            if (!updatedUser) {
                throw new Error("USER_NOT_FOUND_AFTER_XP_UPDATE");
            }

            // Resolve level
            // const levelInfo = await this.levelCalculator.resolveLevel(updatedUser.getXp());

            // // Update level in user
            // await this.userRepo.updateLevel(
            //     userId,
            //     levelInfo.levelNumber
            // );

            const level = await this.levelCalculator.resolveLevel(updatedUser.getXp());

            if (level) {
                // await this.userRepo.updateLevel(userId, level.id!);
                if (level?.id) {
                    await this.userRepo.updateLevel(userId, level.id);
                }


                // optional: auto badge assignment
                if (level.badgeId) {
                    await this.userRepo.updateBadge(userId, level.badgeId);
                }
            }
        }

        return {
            status: finalStatus,
            runtime: maxRuntime,
            memory: memoryUsed,
            xpEarned,
            newLevel: null // simplification, real level would need to be fetched if changed
        };
    }
}
