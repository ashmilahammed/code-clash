import { UserRepository } from "../repositories/UserRepository";
import { WinstonLogger } from "../services/logger";
import { JwtService } from "../security/jwtService";

import { ListUsersUseCase } from "../../application/use-cases/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/updateUserStatusUseCase";

import { AdminController } from "../../presentation/controllers/admin.controllers";
import { createAuthMiddleware } from "../../presentation/middlewares/auth.Middleware";
import { createRequireRole } from "../../presentation/middlewares/role.Middleware";



// core dependencies
const userRepository = new UserRepository();
const logger = new WinstonLogger();
const jwtService = new JwtService();

// use cases
const listUsersUseCase = new ListUsersUseCase(userRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository, logger);

//middleware
export const authMiddleware = createAuthMiddleware(
  userRepository,
  jwtService,
  logger
);

export const requireAdmin = createRequireRole(
  "admin",
  logger
);

// controllers
export const adminController = new AdminController(
  listUsersUseCase,
  updateUserStatusUseCase
);






// import { UserRepository } from "../repositories/UserRepository";
// import { ConsoleLogger } from "../services/logger";

// import { ListUsersUseCase } from "../../application/use-cases/admin/listUsersUseCase";
// import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/updateUserStatusUseCase";

// import { AdminController } from "../../presentation/controllers/admin.controllers";
// import { createAuthMiddleware } from "../../presentation/middlewares/auth.Middleware";
// import { createRequireRole } from "../../presentation/middlewares/role.Middleware";

// // core dependency
// const userRepository = new UserRepository();
// const logger = new ConsoleLogger();

// // use cases
// const listUsersUseCase = new ListUsersUseCase(userRepository);
// const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);

// //middleware
// export const authMiddleware = createAuthMiddleware(
//   userRepository,
//   logger
// );

// export const requireAdmin = createRequireRole(
//   "admin",
//   logger
// );

// //controller
// export const adminController = new AdminController(
//   listUsersUseCase,
//   updateUserStatusUseCase
// );


