import { LevelRepository } from "../repositories/level/LevelRepository";
import { CreateLevelUseCase } from "../../application/use-cases/level/admin/CreateLevelUseCase";
import { LevelController } from "../../presentation/controllers/level.controller";


// repository
const levelRepository = new LevelRepository();

// use cases
const createLevelUseCase = new CreateLevelUseCase(levelRepository);


// controller
export const levelController = new LevelController(
  createLevelUseCase
);
