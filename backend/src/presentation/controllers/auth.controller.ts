import { Request, Response } from "express";

import { RegisterUseCase } from "../../application/use-cases/auth/registerUseCase";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verifyOtpUseCase";
import { ResendOtpUseCase } from "../../application/use-cases/auth/resendOtpUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/loginUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/logoutUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgetPasswordUseCase";
import { VerifyForgotOtpUseCase } from "../../application/use-cases/auth/verifyForgotOtpUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/resetPasswordUseCase";
import { GoogleLoginUseCase } from "../../application/use-cases/auth/googleLoginUseCase";
import { RefreshSessionUseCase } from "../../application/use-cases/auth/refreshSessionUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/auth/getCurrentUserUseCase";


import { ApiResponse } from "../common/ApiResponse";
import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";


export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyForgotOtpUseCase: VerifyForgotOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase
  ) { }



  ///
  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      const result = await this.registerUseCase.execute(
        username,
        email,
        password
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          ApiResponse.success(MESSAGES.AUTH.REGISTER_SUCCESS, {
            userId: result.userId,
          })
        );
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message || MESSAGES.COMMON.BAD_REQUEST));
    }
  };



  ///
  verifyOtp = async (req: Request, res: Response) => {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      await this.verifyOtpUseCase.execute(userId, otp);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.OTP_VERIFIED));
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  resendOtp = async (req: Request, res: Response) => {
    try {
      const { userId, ignoreVerified } = req.body;

      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      await this.resendOtpUseCase.execute(userId, { ignoreVerified });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.OTP_RESENT));
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.loginUseCase.execute(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.AUTH.LOGIN_SUCCESS, {
            user: result.user,
            accessToken: result.accessToken,
          })
        );
    } catch (err: any) {
      if (err.message === "ACCOUNT_BLOCKED") {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json(ApiResponse.error(MESSAGES.AUTH.ACCOUNT_BLOCKED));
      }

      if (err.message === "ACCOUNT_NOT_VERIFIED") {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED));
      }

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  // logout = async (req: any, res: Response) => {
  //   try {
  //     const userId = req.user?.userId;

  //     if (!userId) {
  //       return res
  //         .status(HttpStatus.UNAUTHORIZED)
  //         .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
  //     }

  //     await this.logoutUseCase.execute(userId);

  //     res.clearCookie("refreshToken", {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //     });

  //     return res
  //       .status(HttpStatus.OK)
  //       .json(ApiResponse.success(MESSAGES.AUTH.LOGOUT_SUCCESS));
  //   } catch {
  //     return res
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .json(ApiResponse.error(MESSAGES.COMMON.INTERNAL_ERROR));
  //   }
  // };

  // ================= LOGOUT =================
  logout = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as { userId: string; role: "user" | "admin" } | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      await this.logoutUseCase.execute(user.userId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.LOGOUT_SUCCESS));
    } catch {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };





  ///
  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const result = await this.forgotPasswordUseCase.execute(email);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.AUTH.OTP_SENT, {
            userId: result.userId,
          })
        );
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  verifyForgotOtp = async (req: Request, res: Response) => {
    try {
      const { userId, otp } = req.body;

      await this.verifyForgotOtpUseCase.execute(userId, otp);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.OTP_VERIFIED));
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  resetPassword = async (req: Request, res: Response) => {
    try {
      const { userId, password } = req.body;

      await this.resetPasswordUseCase.execute(userId, password);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  googleLogin = async (req: Request, res: Response) => {
    try {
      const { googleToken } = req.body;

      if (!googleToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const result = await this.googleLoginUseCase.execute(googleToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS, {
            user: result.user,
            accessToken: result.accessToken,
          })
        );
    } catch (err: any) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error(err.message));
    }
  };



  ///
  refreshSession = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      const result = await this.refreshSessionUseCase.execute(refreshToken);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Session refreshed", {
            accessToken: result.accessToken,
          })
        );
    } catch {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error(MESSAGES.AUTH.SESSION_EXPIRED));
    }
  };



  ///
  // me = async (req: any, res: Response) => {
  //   try {
  //     const userId = req.user?.userId;

  //     if (!userId) {
  //       return res
  //         .status(HttpStatus.UNAUTHORIZED)
  //         .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
  //     }

  //     const user = await this.getCurrentUserUseCase.execute(userId);

  //     return res
  //       .status(HttpStatus.OK)
  //       .json(
  //         ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, { user })
  //       );
  //   } catch (err: any) {
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .json(ApiResponse.error(err.message));
  //   }
  // };
  // ================= ME =================
  me = async (req: Request, res: Response) => {
    try {
      const userContext = res.locals.user as { userId: string; role: "user" | "admin" } | undefined;

      if (!userContext) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const user = await this.getCurrentUserUseCase.execute(userContext.userId);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, { user })
        );
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err.message));
    }
  };




}








// import { Request, Response } from "express";

// import { RegisterUseCase } from "../../application/use-cases/auth/registerUseCase";
// import { VerifyOtpUseCase } from "../../application/use-cases/auth/verifyOtpUseCase";
// import { ResendOtpUseCase } from "../../application/use-cases/auth/resendOtpUseCase";
// import { LoginUseCase } from "../../application/use-cases/auth/loginUseCase";
// import { LogoutUseCase } from "../../application/use-cases/auth/logoutUseCase";
// import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgetPasswordUseCase";
// import { VerifyForgotOtpUseCase } from "../../application/use-cases/auth/verifyForgotOtpUseCase";
// import { ResetPasswordUseCase } from "../../application/use-cases/auth/resetPasswordUseCase";
// import { GoogleLoginUseCase } from "../../application/use-cases/auth/googleLoginUseCase";
// import { RefreshSessionUseCase } from "../../application/use-cases/auth/refreshSessionUseCase";
// import { GetCurrentUserUseCase } from "../../application/use-cases/auth/getCurrentUserUseCase";

// export class AuthController {
//   constructor(
//     private readonly registerUseCase: RegisterUseCase,
//     private readonly verifyOtpUseCase: VerifyOtpUseCase,
//     private readonly resendOtpUseCase: ResendOtpUseCase,
//     private readonly loginUseCase: LoginUseCase,
//     private readonly logoutUseCase: LogoutUseCase,
//     private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
//     private readonly verifyForgotOtpUseCase: VerifyForgotOtpUseCase,
//     private readonly resetPasswordUseCase: ResetPasswordUseCase,
//     private readonly googleLoginUseCase: GoogleLoginUseCase,
//     private readonly refreshSessionUseCase: RefreshSessionUseCase,
//     private readonly getCurrentUserUseCase: GetCurrentUserUseCase
//   ) { }

//   // ================= REGISTER =================
//   register = async (req: Request, res: Response) => {
//     try {
//       const { username, email, password } = req.body;

//       const result = await this.registerUseCase.execute(
//         username,
//         email,
//         password
//       );

//       return res.json({
//         message: result.message,
//         userId: result.userId,
//       });
//     } catch (err: any) {
//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to register" });
//     }
//   };

//   // ================= VERIFY OTP =================
//   verifyOtp = async (req: Request, res: Response) => {
//     try {
//       const { userId, otp } = req.body;

//       if (!userId || !otp) {
//         return res
//           .status(400)
//           .json({ message: "userId and OTP are required" });
//       }

//       const result = await this.verifyOtpUseCase.execute(userId, otp);
//       return res.json(result);
//     } catch (err: any) {
//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to verify OTP" });
//     }
//   };

//   // ================= RESEND OTP =================
//   resendOtp = async (req: Request, res: Response) => {
//     try {
//       const { userId, ignoreVerified } = req.body;

//       if (!userId) {
//         return res.status(400).json({ message: "userId is required" });
//       }

//       const result = await this.resendOtpUseCase.execute(userId, {
//         ignoreVerified,
//       });

//       return res.json(result);
//     } catch (err: any) {
//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to resend OTP" });
//     }
//   };

//   // ================= LOGIN =================
//   login = async (req: Request, res: Response) => {
//     try {
//       const { email, password } = req.body;

//       const result = await this.loginUseCase.execute(email, password);

//       res.cookie("refreshToken", result.refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });

//       return res.json({
//         message: "Login successful",
//         user: result.user,
//         accessToken: result.accessToken,
//       });
//     } catch (err: any) {
//       if (err.message === "ACCOUNT_BLOCKED") {
//         return res.status(403).json({
//           message: "Your account has been blocked by Admin",
//           code: "ACCOUNT_BLOCKED",
//         });
//       }

//       if (err.message === "ACCOUNT_NOT_VERIFIED") {
//         return res.status(400).json({
//           message: "Please verify your OTP before logging in",
//           needsVerification: true,
//         });
//       }

//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to login" });
//     }
//   };

//   // ================= LOGOUT =================
//   logout = async (req: any, res: Response) => {
//     try {
//       const userId = req.user?.userId;

//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       await this.logoutUseCase.execute(userId);

//       res.clearCookie("refreshToken", {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//       });

//       return res.json({ message: "Logged out successfully" });
//     } catch (err: any) {
//       return res
//         .status(500)
//         .json({ message: err.message || "Logout failed" });
//     }
//   };

//   // ================= FORGOT PASSWORD =================
//   forgotPassword = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;

//       const result = await this.forgotPasswordUseCase.execute(email);

//       return res.status(200).json({
//         message: "OTP sent to email",
//         userId: result.userId,
//       });
//     } catch (err: any) {
//       return res.status(400).json({
//         message: err.message || "Failed to process forgot password",
//       });
//     }
//   };

//   // ================= VERIFY FORGOT OTP =================
//   verifyForgotOtp = async (req: Request, res: Response) => {
//     try {
//       const { userId, otp } = req.body;

//       const result = await this.verifyForgotOtpUseCase.execute(userId, otp);
//       return res.json(result);
//     } catch (err: any) {
//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to verify OTP" });
//     }
//   };

//   // ================= RESET PASSWORD =================
//   resetPassword = async (req: Request, res: Response) => {
//     try {
//       const { userId, password } = req.body;

//       const result = await this.resetPasswordUseCase.execute(userId, password);
//       return res.json(result);
//     } catch (err: any) {
//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to reset password" });
//     }
//   };

//   // ================= GOOGLE LOGIN =================
//   googleLogin = async (req: Request, res: Response) => {
//     try {
//       const { googleToken } = req.body;

//       if (!googleToken) {
//         return res
//           .status(400)
//           .json({ message: "Google ID token is required" });
//       }

//       const result = await this.googleLoginUseCase.execute(googleToken);

//       res.cookie("refreshToken", result.refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });

//       return res.status(200).json({
//         user: result.user,
//         accessToken: result.accessToken,
//       });
//     } catch (err: any) {
//       return res
//         .status(401)
//         .json({ message: err.message || "Google login failed" });
//     }
//   };

//   // ================= REFRESH SESSION =================
//   refreshSession = async (req: Request, res: Response) => {
//     try {
//       const refreshToken = req.cookies?.refreshToken;

//       const result = await this.refreshSessionUseCase.execute(refreshToken);

//       return res.status(200).json({
//         accessToken: result.accessToken,
//       });
//     } catch (err: any) {
//       if (err.message === "ACCOUNT_BLOCKED") {
//         return res.status(403).json({
//           message: "Your account has been blocked by Admin",
//           code: "ACCOUNT_BLOCKED",
//         });
//       }

//       return res
//         .status(401)
//         .json({ message: err.message || "Session expired" });
//     }
//   };

//   // ================= ME =================
//   me = async (req: any, res: Response) => {
//     try {
//       const userId = req.user?.userId;

//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       const user = await this.getCurrentUserUseCase.execute(userId);
//       return res.status(200).json({ user });
//     } catch (err: any) {
//       return res
//         .status(400)
//         .json({ message: err.message || "Failed to fetch user" });
//     }
//   };
// }












