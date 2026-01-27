import { UserRepository } from "../repositories/UserRepository";
import { XpService } from "../services/xpService";
import { GetDashboardUseCase } from "../../application/use-cases/user/getDashboardUseCase";
import { UserController } from "../../presentation/controllers/user.controller";


// core dependencies
const userRepository = new UserRepository();
const xpService = new XpService();

// use cases
const getDashboardUseCase = new GetDashboardUseCase(
  userRepository,
  xpService
);

// controller
export const userController = new UserController(
  getDashboardUseCase
);
