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
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.Middleware";



const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController)

router.post("/login", loginController);

router.post("/google", googleLoginController)

router.post("/forgot-password", forgotPasswordController);
router.post("/forgot-password/verify-otp", verifyForgotOtpController);
router.post("/reset-password", resetPasswordController);

//session handle
router.get('/refresh',refreshSessionController)


//protected logout
router.post('/logout', authMiddleware, logoutController)



export default router;
