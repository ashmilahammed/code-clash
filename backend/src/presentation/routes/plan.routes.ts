import { Router } from "express";
import { planController } from "../../infrastructure/di/plan.di";
// import { authMiddleware } from "../../infrastructure/di/auth.di";
// import { requireAdminRole } from "../../infrastructure/di/role.di";

const router = Router();

// Apply auth middleware and limit to admin roles for administrative routes
// router.use(authMiddleware);
// router.use(requireAdminRole);

// Routes
router.post("/", planController.createPlan.bind(planController));
router.get("/", planController.getPlans.bind(planController));
router.put("/:id", planController.updatePlan.bind(planController));
router.delete("/:id", planController.deletePlan.bind(planController));

export default router;
