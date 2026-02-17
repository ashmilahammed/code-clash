import { Router } from "express";
import { badgeController } from "../../infrastructure/di/badge.di";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { requireAdmin } from "../../infrastructure/di/user.di";

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/", badgeController.getAll);
router.post("/", badgeController.create); 
router.patch('/:id' ,badgeController.update);
router.delete("/:id", badgeController.delete)


export default router;
