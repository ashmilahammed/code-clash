import { Router } from "express";
import { registerController, loginController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.Middleware";


const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);

// Protected example route
router.get("/me", authMiddleware, (req: any, res) => {
  return res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;
