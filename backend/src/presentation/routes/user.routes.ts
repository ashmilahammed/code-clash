import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { userController } from "../../infrastructure/di/user.di";
import { planController } from "../../infrastructure/di/plan.di";

import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, userController.getDashboard);
router.get("/profile/stats", authMiddleware, userController.getProfileStats);
router.get("/leaderboard", authMiddleware, userController.getLeaderboard);


router.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  userController.updateAvatar
);

router.delete(
  "/avatar",
  authMiddleware,
  userController.removeAvatar
);

router.put(
  "/premium/cancel",
  authMiddleware,
  userController.cancelPremium
);

router.get("/plans", authMiddleware, planController.getPublicPlans.bind(planController));

export default router;
