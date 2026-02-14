import { UserRepository } from "../repositories/user/UserRepository";
import { XpService } from "../services/xpService";
import { WinstonLogger } from "../services/logger";
// import { JwtService } from "../services/security/jwtService";

import { GetDashboardUseCase } from "../../application/use-cases/user/user/getDashboardUseCase";
import { ListUsersUseCase } from "../../application/use-cases/user/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/user/admin/updateUserStatusUseCase";

import { UserController } from "../../presentation/controllers/user.controller";
import { AdminController } from "../../presentation/controllers/admin.controllers";

// import { createAuthMiddleware } from "../../presentation/middlewares/auth.Middleware";
import { createRequireRole } from "../../presentation/middlewares/role.Middleware";



// core dependencies
const userRepository = new UserRepository();
const xpService = new XpService();
const logger = new WinstonLogger();
// const jwtService = new JwtService();



// user
const getDashboardUseCase = new GetDashboardUseCase(
  userRepository,
  xpService
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
  getDashboardUseCase
);

export const adminController = new AdminController(
  listUsersUseCase,
  updateUserStatusUseCase
);






