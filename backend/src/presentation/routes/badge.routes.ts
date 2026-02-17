import { Router } from "express";
import { badgeController } from "../../infrastructure/di/badge.di";
// import { authMiddleware, adminMiddleware } from "../../infrastructure/middlewares/auth.middleware"; // Assuming these exist, but for now keeping open or checking

const router = Router();

router.get("/", badgeController.getAll);
router.post("/", badgeController.create); 

export default router;
