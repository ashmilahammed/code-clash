import { CreateLevelUseCase } from "../../application/use-cases/level/admin/CreateLevelUseCase";
import { GetLevelsUseCase } from "../../application/use-cases/level/GetLevelsUseCase";
import { UpdateLevelUseCase } from "../../application/use-cases/level/admin/UpdateLevelUseCase";
import { DeleteLevelUseCase } from "../../application/use-cases/level/admin/DeleteLevelUseCase";

import { LevelController } from "../../presentation/controllers/level.controller";
import { LevelRepository } from "../repositories/level/LevelRepository";


// repository
const levelRepository = new LevelRepository();

// use cases
const createLevelUseCase = new CreateLevelUseCase(levelRepository);
const getLevelsUseCase = new GetLevelsUseCase(levelRepository);
const updateLevelUseCase = new UpdateLevelUseCase(levelRepository);
const deleteLevelUseCase = new DeleteLevelUseCase(levelRepository);


// controller
export const levelController = new LevelController(
  createLevelUseCase,
  getLevelsUseCase,
  updateLevelUseCase,
  deleteLevelUseCase
);
