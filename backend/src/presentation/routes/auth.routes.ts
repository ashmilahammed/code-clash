import { Router } from "express";
import { registerController, verifyOtpController, resendOtpController } from "../controllers/auth.controller";
import { loginController, logoutController } from "../controllers/auth.controller";
import { forgotPasswordController, verifyForgotOtpController, resetPasswordController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.Middleware";


const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController)

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);
router.post("/forgot-password/verify-otp", verifyForgotOtpController);
router.post("/reset-password", resetPasswordController);

//protected logout
router.post('/logout', authMiddleware, logoutController)



export default router;
