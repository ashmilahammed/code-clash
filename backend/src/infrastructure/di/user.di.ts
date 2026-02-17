import { UserRepository } from "../repositories/user/UserRepository";
import { SubmissionRepository } from "../repositories/submission/SubmissionRepository";
import { LevelRepository } from "../repositories/level/LevelRepository";
import { XpService } from "../services/xpService";
import { WinstonLogger } from "../services/logger";

import { CloudinaryStorageService } from "../adapters/fileStorage/CloudinaryStorageService";

import { GetDashboardUseCase } from "../../application/use-cases/user/user/getDashboardUseCase";
import { GetLeaderboardUseCase } from "../../application/use-cases/user/user/getLeaderboardUseCase";
import { ListUsersUseCase } from "../../application/use-cases/user/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/user/admin/updateUserStatusUseCase";
import { UpdateUserAvatarUseCase } from "../../application/use-cases/user/user/updateUserAvatarUseCase";

import { UserController } from "../../presentation/controllers/user.controller";
import { AdminController } from "../../presentation/controllers/admin.controllers";

// import { createAuthMiddleware } from "../../presentation/middlewares/auth.Middleware";
import { createRequireRole } from "../../presentation/middlewares/role.Middleware";



// core dependencies
const userRepository = new UserRepository();
const submissionRepository = new SubmissionRepository();
const levelRepository = new LevelRepository();
const xpService = new XpService();
const logger = new WinstonLogger();
const fileStorage = new CloudinaryStorageService();


// user
const getDashboardUseCase = new GetDashboardUseCase(
  userRepository,
  xpService
);

const getLeaderboardUseCase = new GetLeaderboardUseCase(
  userRepository,
  submissionRepository,
  levelRepository
);


const updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
  userRepository,
  fileStorage
);


//admin(user management)
const listUsersUseCase = new ListUsersUseCase(userRepository);

const updateUserStatusUseCase = new UpdateUserStatusUseCase(
  userRepository,
  logger
);



// middlewares
// export const authMiddleware = createAuthMiddleware(
//   userRepository,
//   jwtService,
//   logger
// );

export const requireAdmin = createRequireRole(
  "admin",
  logger
);



// controllers
export const userController = new UserController(
  getDashboardUseCase,
  getLeaderboardUseCase,
  updateUserAvatarUseCase
);

export const adminController = new AdminController(
  listUsersUseCase,
  updateUserStatusUseCase
);






