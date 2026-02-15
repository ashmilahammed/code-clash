import { SubmissionRepository } from "../repositories/submission/SubmissionRepository";
import { ChallengeRepository } from "../repositories/challenge/ChallengeRepository";
import { ChallengeTestCaseRepository } from "../repositories/challenge/ChallengeTestCaseRepository";
import { PistonExecutionService } from "../adapters/codeExecution/PistonExecutionService";
import { UserRepository } from "../repositories/user/UserRepository";
import { LevelRepository } from "../repositories/level/LevelRepository";
import { LevelCalculator } from "../services/levelCalculator";

import { RunCodeUseCase } from "../../application/use-cases/submission/RunCodeUseCase";
import { SubmitSolutionUseCase } from "../../application/use-cases/submission/SubmitSolutionUseCase";

import { SubmissionController } from "../../presentation/controllers/submission.controller";


// Repositories
const submissionRepo = new SubmissionRepository();
const challengeRepo = new ChallengeRepository();
const testCaseRepo = new ChallengeTestCaseRepository();
const userRepo = new UserRepository();
const levelRepo = new LevelRepository();

// Services
const executionService = new PistonExecutionService();
const levelCalculator = new LevelCalculator(levelRepo);

// Use cases
const runUseCase = new RunCodeUseCase(executionService);

const submitUseCase = new SubmitSolutionUseCase(
  challengeRepo,
  testCaseRepo,
  submissionRepo,
  executionService,
  userRepo,
  levelCalculator
);

// Controller
export const submissionController = new SubmissionController(
  submitUseCase,
  runUseCase
);
