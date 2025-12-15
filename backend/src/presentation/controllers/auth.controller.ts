import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { registerUseCase } from "../../application/use-cases/auth/registerUseCase";
import { verifyOtpUseCase } from "../../application/use-cases/auth/verifyOtpUseCase";
import { resendOtpUseCase } from "../../application/use-cases/auth/resendOtpUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/loginUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/logoutUseCase";

import { forgotPasswordUseCase } from "../../application/use-cases/auth/forgetPasswordUseCase";
import { verifyForgotOtpUseCase } from "../../application/use-cases/auth/verifyForgotOtpUseCase";
import { resetPasswordUseCase } from "../../application/use-cases/auth/resetPasswordUseCase";

import { generateOtp } from "../../utils/generateOtp";
import { EmailService } from "../../infrastructure/services/emailService";

import { googleLoginUseCase } from "../../application/use-cases/auth/googleLoginUseCase";


// repository + use-case instance
const userRepo = new UserRepository();
const loginUseCase = new LoginUseCase(userRepo);
const logoutUseCase = new LogoutUseCase(userRepo);


///
export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const result = await registerUseCase(username, email, password);

    return res.json({
      message: result.message,
      userId: result.userId, // needed for /verify-otp
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to register" });
  }
};


///
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "userId and OTP are required" });
    }

    const result = await verifyOtpUseCase(userId, otp);

    return res.json(result);

  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to Verify OTP" });
  }
};



///
export const resendOtpController = async (req: Request, res: Response) => {
  try {
    const { userId, ignoreVerified } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await resendOtpUseCase(userId, { ignoreVerified });

    return res.json(result);

  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to resend OTP" });
  }
};




// login (only if verified)
// export const loginController = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userRepo.findByEmail(email);
//     if (!user) throw new Error("User not found");

//     // If user is NOT verified, redirect
//     if (!user.isVerified) {
//       return res.status(400).json({
//         message: "Please verify your OTP before logging in",
//         userId: user.id,
//         needsVerification: true,
//       });
//     }

//     // User is verified ,continue login
//     const result = await loginUseCase.execute(email, password);

//     return res.json({
//       message: "Login successful",
//       user: result.user,
//       accessToken: result.accessToken,
//       refreshToken: result.refreshToken,
//     });

//   } catch (err: any) {
//     return res.status(400).json({ message: err.message });
//   }
// };
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");


    if (!user.isVerified) {

      const { otp, expires } = generateOtp();

      // Store OTP in DB
      await userRepo.saveOtp(user.id!, otp, expires, true);

      await new EmailService().sendOtpEmail(email, otp);

      ///
      console.log(`LOGIN (unverified user) OTP for ${email}: ${otp}`);

      return res.status(400).json({
        message: "Please verify your OTP before logging in",
        needsVerification: true,
        userId: user.id,
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    }

    // If verified, continue login
    const result = await loginUseCase.execute(email, password);

    return res.json({
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to Login" });
  }
};



///
export const logoutController = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await logoutUseCase.execute(userId);

    return res.json(result);

  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Logout Failed" });
  }
};



///
export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordUseCase(email);
    return res.json(result);

  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to get Forgot Password" });
  }
};


///
export const verifyForgotOtpController = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;
    const result = await verifyForgotOtpUseCase(userId, otp);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to verify OTP" });
  }
};


// 
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    const result = await resetPasswordUseCase(userId, password);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to reset Password" });
  }
};





// 

export const googleLoginController = async (req: Request, res: Response) => {
  try {

    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        message: "Google ID token is required",
      });
    }

    const result = await googleLoginUseCase(googleToken);

    return res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

  } catch (err: any) {
    return res.status(401).json({
      message: err.message || "Google login failed",
    });
  }
};

