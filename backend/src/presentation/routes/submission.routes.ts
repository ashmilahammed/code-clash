import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { submissionController } from "../../infrastructure/di/submission.di";
import { executionLimiter } from "../middlewares/rateLimiter";

const router = Router();

// router.post("/run", authMiddleware, executionLimiter, submissionController.run);
router.post("/run",executionLimiter, submissionController.run);
router.post("/submit", authMiddleware, executionLimiter, submissionController.submit);

export default router;
