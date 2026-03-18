import { Router } from "express";

import { authController,authMiddleware } from "../../infrastructure/di/auth.di";

import { registerValidator } from "../validators/register.validators";
import { loginValidator } from "../validators/login.validator";


const router = Router();

//public 
router.post("/register", registerValidator, authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

router.post("/login", loginValidator, authController.login);
router.post("/google", authController.googleLogin);

router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/forgot-password/verify-otp",
  authController.verifyForgotOtp
);
router.post("/reset-password", authController.resetPassword);

//session
router.get("/refresh-session", authController.refreshSession);

//protected
router.post("/logout", authMiddleware, authController.logout);
router.post("/change-password", authMiddleware, authController.changePassword);
router.get("/me", authMiddleware, authController.me);

export default router;






