import { Router } from "express";
import { registerController, loginController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.Middleware";


const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);

// Protected route example
router.get("/me", authMiddleware, (req: any, res) => {
  res.json({ 
    message: "Protected route accessed",
    user: req.user 
  });
});

export default router;
