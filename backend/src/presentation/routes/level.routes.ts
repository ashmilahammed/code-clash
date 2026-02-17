import { Router } from "express";
import { levelController } from "../../infrastructure/di/level.di";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { requireAdmin } from "../../infrastructure/di/user.di";


const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/", levelController.getAll);
router.post("/", levelController.create);
router.patch("/:id", levelController.update);
router.delete("/:id", levelController.delete);

export default router;
