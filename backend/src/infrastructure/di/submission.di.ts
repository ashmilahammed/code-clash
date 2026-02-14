import { SubmissionRepository } from "../repositories/submission/SubmissionRepository";
import { ChallengeRepository } from "../repositories/challenge/ChallengeRepository";
import { ChallengeTestCaseRepository } from "../repositories/challenge/ChallengeTestCaseRepository";
import { PistonExecutionService } from "../adapters/codeExecution/PistonExecutionService";

import { RunCodeUseCase } from "../../application/use-cases/submission/RunCodeUseCase";
import { SubmitSolutionUseCase } from "../../application/use-cases/submission/SubmitSolutionUseCase";

import { SubmissionController } from "../../presentation/controllers/submission.controller";

// dependencies
const submissionRepo = new SubmissionRepository();
const challengeRepo = new ChallengeRepository();
const testCaseRepo = new ChallengeTestCaseRepository();
const executionService = new PistonExecutionService();

// use cases
const runUseCase = new RunCodeUseCase(executionService);

const submitUseCase = new SubmitSolutionUseCase(
  challengeRepo,
  testCaseRepo,
  submissionRepo,
  executionService
);

// controller
export const submissionController = new SubmissionController(
  submitUseCase,
  runUseCase
);
