import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { challengeController } from "../../infrastructure/di/challenge.di";

const router = Router();

// user only
router.get("/", authMiddleware, challengeController.userList);

router.get("/:id", authMiddleware, challengeController.getById);
router.get("/:id/templates", authMiddleware, challengeController.getTemplates);
router.get("/:id/hints", authMiddleware, challengeController.getHints);
router.get("/:id/test-cases", authMiddleware, challengeController.getTestCases);

// languages (read-only)
router.get("/:id/languages", authMiddleware, challengeController.getChallengeLanguages);

export default router;















