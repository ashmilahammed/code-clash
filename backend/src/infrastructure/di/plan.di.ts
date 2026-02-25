import { CreatePlanUseCase } from "../../application/use-cases/admin/plans/CreatePlanUseCase";
import { GetPlansUseCase } from "../../application/use-cases/admin/plans/GetPlansUseCase";
import { UpdatePlanUseCase } from "../../application/use-cases/admin/plans/UpdatePlanUseCase";
import { DeletePlanUseCase } from "../../application/use-cases/admin/plans/DeletePlanUseCase";
import { PlanController } from "../../presentation/controllers/plan.controller";
import { PlanRepository } from "../repositories/admin/PlanRepository";
import { WinstonLogger } from "../services/logger";

// Shared services
const logger = new WinstonLogger();

// Repositories
const planRepository = new PlanRepository();

// Use Cases
const createPlanUseCase = new CreatePlanUseCase(planRepository);
const getPlansUseCase = new GetPlansUseCase(planRepository);
const updatePlanUseCase = new UpdatePlanUseCase(planRepository);
const deletePlanUseCase = new DeletePlanUseCase(planRepository);

// Controller
export const planController = new PlanController(
    createPlanUseCase,
    getPlansUseCase,
    updatePlanUseCase,
    deletePlanUseCase,
    logger
);
