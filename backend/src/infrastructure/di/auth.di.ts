import { UserRepository } from "../repositories/user/UserRepository";
import { EmailService } from "../services/emailService";
import { JwtService } from "../services/security/jwtService";
import { PasswordService } from "../services/security/passwordService";

import { WinstonLogger } from "../services/logger";


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

import { UpdateLoginStreakUseCase } from "../../application/use-cases/user/user/updateLoginStreakUseCase";

import { OAuth2Client } from "google-auth-library";
import { AuthController } from "../../presentation/controllers/auth.controller";
import { createAuthMiddleware } from "../../presentation/middlewares/auth.Middleware";


// core dependencies
const userRepository = new UserRepository();
const emailService = new EmailService();
const logger = new WinstonLogger();
const passwordService = new PasswordService()
const jwtService = new JwtService();


// google client
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClient = new OAuth2Client(googleClientId);

// use cases
const registerUseCase = new RegisterUseCase(
    userRepository,
    emailService,
    passwordService
);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository);
const resendOtpUseCase = new ResendOtpUseCase(userRepository, emailService);

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordService);


//
const updateLoginStreakUseCase = new UpdateLoginStreakUseCase(userRepository);

const loginUseCase = new LoginUseCase(
    userRepository,
    emailService,
    passwordService,
    jwtService,
    updateLoginStreakUseCase
);

const logoutUseCase = new LogoutUseCase(userRepository);

const refreshSessionUseCase = new RefreshSessionUseCase(userRepository, jwtService);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

const googleLoginUseCase = new GoogleLoginUseCase(
    userRepository,
    jwtService,
    googleClient,
    googleClientId
);

//middleware
export const authMiddleware = createAuthMiddleware(
    userRepository,
    jwtService,
    logger
);

// controllers
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









