import { Router } from "express";
import {
  registerController,
  verifyOtpController,
  resendOtpController,
  loginController,
  logoutController,
  forgotPasswordController,
  verifyForgotOtpController,
  resetPasswordController,
  googleLoginController,
  refreshSessionController,
  meController
} from "../controllers/auth.controller";
import { registerValidator } from "../validators/register.validators";
import { loginValidator } from "../validators/login.validator";

import { authMiddleware } from "../middlewares/auth.Middleware";



const router = Router();

// Public routes
router.post("/register", registerValidator, registerController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController)

router.post("/login", loginValidator, loginController);

router.post("/google", googleLoginController)

router.post("/forgot-password", forgotPasswordController);
router.post("/forgot-password/verify-otp", verifyForgotOtpController);
router.post("/reset-password", resetPasswordController);

//session handle
router.get('/refresh-session', refreshSessionController)


//protected logout
router.post('/logout', authMiddleware, logoutController);
router.get("/me", authMiddleware, meController);



export default router;
