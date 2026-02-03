import { ChallengeRepository } from "../repositories/ChallengeRepository";

import { CreateChallengeUseCase } from "../../application/use-cases/admin/createChallengeUseCase";
import { ListAdminChallengesUseCase } from "../../application/use-cases/admin/listAdminChallengesUseCase";
import { ListChallengesUseCase } from "../../application/use-cases/user/listChallengesUseCase";
import { ToggleChallengeStatusUseCase } from "../../application/use-cases/admin/toggleChallengeStatusUseCase";

import { ChallengeController } from "../../presentation/controllers/challenge.controller";

// repository
const challengeRepository = new ChallengeRepository();

// use cases
const createChallengeUseCase =
  new CreateChallengeUseCase(challengeRepository);

const adminListChallengesUseCase =
  new ListAdminChallengesUseCase(challengeRepository);

const userListChallengesUseCase =
  new ListChallengesUseCase(challengeRepository);

const toggleChallengeStatusUseCase =
  new ToggleChallengeStatusUseCase(challengeRepository);

// controller
export const challengeController = new ChallengeController(
  createChallengeUseCase,
  adminListChallengesUseCase,
  userListChallengesUseCase,
  toggleChallengeStatusUseCase
);
