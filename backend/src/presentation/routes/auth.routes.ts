import { Router } from "express";

import { authController,authMiddleware } from "../../infrastructure/di/auth.di";

import { registerValidator } from "../validators/register.validators";
import { loginValidator } from "../validators/login.validator";
import { authLimiter } from "../middlewares/rateLimiter";


const router = Router();

//public 
router.post("/register", authLimiter, registerValidator, authController.register);
router.post("/verify-otp", authLimiter, authController.verifyOtp);
router.post("/resend-otp", authLimiter, authController.resendOtp);

router.post("/login", authLimiter, loginValidator, authController.login);
router.post("/google", authLimiter, authController.googleLogin);

router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post(
  "/forgot-password/verify-otp",
  authLimiter,
  authController.verifyForgotOtp
);
router.post("/reset-password", authLimiter, authController.resetPassword);

//session
router.get("/refresh-session", authController.refreshSession);

//protected
router.post("/logout", authMiddleware, authController.logout);
router.post("/change-password", authMiddleware, authController.changePassword);
router.get("/me", authMiddleware, authController.me);

export default router;






