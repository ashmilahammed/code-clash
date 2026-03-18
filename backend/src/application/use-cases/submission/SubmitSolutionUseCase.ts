import { IChallengeRepository } from "../../../domain/repositories/challenge/IChallengeRepository";
import { IChallengeTestCaseRepository } from "../../../domain/repositories/challenge/IChallengeTestCaseRepository";
import { ISubmissionRepository } from "../../../domain/repositories/submission/ISubmissionRepository";
import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";
import { Submission } from "../../../domain/entities/submission/Submission";

import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { ILevelRepository } from "../../../domain/repositories/level/ILevelRepository";
import { IBadgeRewardService } from "../../../domain/services/IBadgeRewardService";
import { Badge } from "../../../domain/entities/badge/Badge";



export class SubmitSolutionUseCase {
    constructor(
        private readonly _challengeRepo: IChallengeRepository,
        private readonly _testCaseRepo: IChallengeTestCaseRepository,
        private readonly _submissionRepo: ISubmissionRepository,
        private readonly _executionService: ICodeExecutionService,

        private readonly _userRepo: IUserRepository,
        private readonly _levelRepo: ILevelRepository,
        private readonly _badgeRewardService: IBadgeRewardService
    ) { }



    async execute(params: {
        userId: string;
        challengeId: string;
        language: string;
        code: string;
    }) {
        const { userId, challengeId, language, code } = params;

        // Get challenge (for XP)
        const challenge = await this._challengeRepo.findByIdForUser(
            challengeId
        );

        if (!challenge) {
            throw new Error("Challenge not found");
        }

        const user = await this._userRepo.findById(userId);
        if (challenge.isPremium && !user?.is_premium) {
            throw new Error("Premium upgrade required to access this challenge");
        }


        // Check allowed language
        const challengeWithLang =
            await this._challengeRepo.findByIdWithLanguages(challengeId);

        if (
            !challengeWithLang?.languages.some(
                (l) => l.key === language
            )
        ) {
            throw new Error("Language not allowed for this challenge");
        }



        // Get all test cases
        const testCases =
            await this._testCaseRepo.findByChallenge(challengeId);

        let hiddenCases = testCases.filter(
            (tc) => !tc.isSample
        );

        if (hiddenCases.length === 0) {
            hiddenCases = testCases;
        }

        if (hiddenCases.length === 0) {
            throw new Error("No test cases found for this challenge");
        }

        let finalStatus: "PASSED" | "FAILED" | "ERROR" = "PASSED";
        let maxRuntime = 0;
        let memoryUsed = 0;


        //
        for (const testCase of hiddenCases) {
            const result = await this._executionService.execute(
                language,
                code,
                testCase.input
            );

            if (result.stderr && result.stderr.trim().length > 0 && !result.stdout) {
                finalStatus = "ERROR";
                break;
            }


            // Normalize helper
            const normalize = (str: string) =>
                str.replace(/\r\n/g, "\n").trim();

            const normalizedOutput = normalize(result.stdout);
            const expectedOutput = normalize(testCase.expectedOutput);

            if (normalizedOutput !== expectedOutput) {
                finalStatus = "FAILED";
                break;
            }

            const runtime = result.runtime ?? 0;
            if (runtime > maxRuntime) {
                maxRuntime = runtime;
            }

            if (result.memory > memoryUsed) {
                memoryUsed = result.memory;
            }

        }

        // Check first solve
        const alreadySolved =
            await this._submissionRepo.hasUserSolvedChallenge(
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

        //
        await this._submissionRepo.create(submission);


        // XP + Level 
        if (xpEarned > 0) {

            await this._userRepo.addXp(userId, xpEarned);

            // 
            const updatedUser = await this._userRepo.findById(userId);
            if (!updatedUser) {
                throw new Error("USER_NOT_FOUND_AFTER_XP_UPDATE");
            }

            // Resolve level
            const level = await this._levelRepo.findByXp(updatedUser.getXp());

            // update level in user
            if (level) {
                if (level?.id) {
                    await this._userRepo.updateLevel(userId, level.id);
                }

                // Automatic Badge Rewards(level)
                const levelNumber = level.levelNumber;
                await this._badgeRewardService.checkAndReward(updatedUser, Badge.REQUIREMENT_TYPES.LEVEL_REACHED, levelNumber);
            }

            // Automatic Badge Rewards(challenge)
            const solvedCount = await this._submissionRepo.countSolved(userId);
            await this._badgeRewardService.checkAndReward(updatedUser, Badge.REQUIREMENT_TYPES.CHALLENGE_COMPLETED, solvedCount);
        }

        return {
            status: finalStatus,
            runtime: maxRuntime,
            memory: memoryUsed,
            xpEarned,
            newLevel: null // 
        };
    }
}
