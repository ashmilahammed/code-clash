import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { userController } from "../../infrastructure/di/user.di";

import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, userController.getDashboard);
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


export default router;
