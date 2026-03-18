import { Router } from "express";
import { planController } from "../../infrastructure/di/plan.di";


const router = Router();

// Routes
router.post("/", planController.createPlan.bind(planController));
router.get("/", planController.getPlans.bind(planController));
router.put("/:id", planController.updatePlan.bind(planController));
router.delete("/:id", planController.deletePlan.bind(planController));

export default router;
