import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { userController } from "../../infrastructure/di/user.di";

const router = Router();

router.get("/dashboard", authMiddleware, userController.getDashboard);

export default router;
