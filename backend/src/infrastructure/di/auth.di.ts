import { UserRepository } from "../repositories/UserRepository";
import { EmailService } from "../services/emailService";

import { RegisterUseCase } from "../../application/use-cases/auth/registerUseCase";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verifyOtpUseCase";
import { ResendOtpUseCase } from "../../application/use-cases/auth/resendOtpUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgetPasswordUseCase";
import { VerifyForgotOtpUseCase } from "../../application/use-cases/auth/verifyForgotOtpUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/resetPasswordUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/loginUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/logoutUseCase";
import { RefreshSessionUseCase } from "../../application/use-cases/auth/refreshSessionUseCase";
import { GetCurrentUserUseCase } from "../../application/use-cases/auth/getCurrentUserUseCase";
import { GoogleLoginUseCase } from "../../application/use-cases/auth/googleLoginUseCase";

import { OAuth2Client } from "google-auth-library";
import { AuthController } from "../../presentation/controllers/auth.controller";


// ================= ENV VALIDATION =================
const googleClientId = process.env.GOOGLE_CLIENT_ID;
if (!googleClientId) {
  throw new Error("GOOGLE_CLIENT_ID is not defined");
}

// ================= REPOSITORIES =================
const userRepository = new UserRepository();

// ================= SERVICES =================
const emailService = new EmailService();

// ================= GOOGLE CLIENT =================
const googleClient = new OAuth2Client(googleClientId);

// ================= USE CASES =================
const registerUseCase = new RegisterUseCase(userRepository, emailService);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository);
const resendOtpUseCase = new ResendOtpUseCase(userRepository, emailService);

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

const googleLoginUseCase = new GoogleLoginUseCase(
  userRepository,
  googleClient,
  googleClientId
);

const loginUseCase = new LoginUseCase(userRepository, emailService);
const logoutUseCase = new LogoutUseCase(userRepository);
const refreshSessionUseCase = new RefreshSessionUseCase(userRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

// ================= CONTROLLER (NEW & IMPORTANT) =================
export const authController = new AuthController(
  registerUseCase,
  verifyOtpUseCase,
  resendOtpUseCase,
  loginUseCase,
  logoutUseCase,
  forgotPasswordUseCase,
  verifyForgotOtpUseCase,
  resetPasswordUseCase,
  googleLoginUseCase,
  refreshSessionUseCase,
  getCurrentUserUseCase
);







// import { UserRepository } from "../repositories/UserRepository";
// import { EmailService } from "../services/emailService";

// import { RegisterUseCase } from "../../application/use-cases/auth/registerUseCase";
// import { VerifyOtpUseCase } from "../../application/use-cases/auth/verifyOtpUseCase";
// import { ResendOtpUseCase } from "../../application/use-cases/auth/resendOtpUseCase";

// import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgetPasswordUseCase";
// import { VerifyForgotOtpUseCase } from "../../application/use-cases/auth/verifyForgotOtpUseCase";

// import { ResetPasswordUseCase } from "../../application/use-cases/auth/resetPasswordUseCase";

// import { OAuth2Client } from "google-auth-library";
// import { GoogleLoginUseCase } from "../../application/use-cases/auth/googleLoginUseCase";

// import { LoginUseCase } from "../../application/use-cases/auth/loginUseCase";
// import { LogoutUseCase } from "../../application/use-cases/auth/logoutUseCase";

// import { RefreshSessionUseCase } from "../../application/use-cases/auth/refreshSessionUseCase";
// import { GetCurrentUserUseCase } from "../../application/use-cases/auth/getCurrentUserUseCase";



// // Validate env first
// const googleClientId = process.env.GOOGLE_CLIENT_ID;
// if (!googleClientId) {
//     throw new Error("GOOGLE_CLIENT_ID is not defined");
// }


// // repositories
// const userRepository = new UserRepository();

// // services
// const emailService = new EmailService();

// // Google OAuth client - initialize AFTER validation
// const googleClient = new OAuth2Client(googleClientId);


// // use cases
// export const registerUseCase = new RegisterUseCase(userRepository, emailService);

// export const verifyOtpUseCase = new VerifyOtpUseCase(userRepository);

// export const resendOtpUseCase = new ResendOtpUseCase(userRepository, emailService);

// export const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);

// export const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(userRepository);

// export const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

// export const googleLoginUseCase = new GoogleLoginUseCase(userRepository, googleClient, googleClientId);

// export const loginUseCase = new LoginUseCase(userRepository, emailService);

// export const logoutUseCase = new LogoutUseCase(userRepository);

// export const refreshSessionUseCase = new RefreshSessionUseCase(userRepository)

// export const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);