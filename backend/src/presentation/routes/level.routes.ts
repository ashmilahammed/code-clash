import { Router } from "express";
import { levelController } from "../../infrastructure/di/level.di";
// import { authMiddleware } from "../../infrastructure/di/auth.di"; // Assuming these exist

const router = Router();

router.get("/", levelController.getAll);
router.post("/", levelController.create);
router.patch("/:id", levelController.update);
router.delete("/:id", levelController.delete);

export default router;
