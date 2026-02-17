import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { submissionController } from "../../infrastructure/di/submission.di";

const router = Router();

// router.post("/run", authMiddleware, submissionController.run);
router.post("/run", submissionController.run);
router.post("/submit", authMiddleware, submissionController.submit);

export default router;
