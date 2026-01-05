// import { UserRepository } from "../repositories/UserRepository";

// import { ListUsersUseCase } from "../../application/use-cases/admin/listUsersUseCase";
// import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/updateUserStatusUseCase";

// import { AdminController } from "../../presentation/controllers/admin.controllers";


// // repositories
// const userRepository = new UserRepository();

// // use cases
// const listUsersUseCase = new ListUsersUseCase(userRepository);
// const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);

// // controller
// export const adminController = new AdminController(
//   listUsersUseCase,
//   updateUserStatusUseCase
// );


import { UserRepository } from "../repositories/UserRepository";
import { ConsoleLogger } from "../services/logger";

import { ListUsersUseCase } from "../../application/use-cases/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/updateUserStatusUseCase";

import { AdminController } from "../../presentation/controllers/admin.controllers";
import { createAuthMiddleware } from "../../presentation/middlewares/auth.Middleware";
import { createRequireRole } from "../../presentation/middlewares/role.Middleware";

// ================= CORE DEPENDENCIES =================
const userRepository = new UserRepository();
const logger = new ConsoleLogger();

// ================= USE CASES =================
const listUsersUseCase = new ListUsersUseCase(userRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);

// ================= MIDDLEWARE =================
export const authMiddleware = createAuthMiddleware(
  userRepository,
  logger
);

export const requireAdmin = createRequireRole(
  "admin",
  logger
);

// ================= CONTROLLER =================
export const adminController = new AdminController(
  listUsersUseCase,
  updateUserStatusUseCase
);




// import { UserRepository } from "../repositories/UserRepository";

// import { ListUsersUseCase } from "../../application/use-cases/admin/listUsersUseCase";
// import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/updateUserStatusUseCase";


// // repository
// const userRepository = new UserRepository();

// // use cases
// export const listUsersUseCase =
//   new ListUsersUseCase(userRepository);

// export const updateUserStatusUseCase =
//   new UpdateUserStatusUseCase(userRepository);
