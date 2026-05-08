import { Request, Response } from "express";

import { IRegisterUseCase } from "../../application/interfaces/auth/IRegisterUseCase";
import { IVerifyOtpUseCase } from "../../application/interfaces/auth/IVerifyOtpUseCase";
import { IResendOtpUseCase } from "../../application/interfaces/auth/IResendOtpUseCase";
import { ILoginUseCase } from "../../application/interfaces/auth/ILoginUseCase";
import { ILogoutUseCase } from "../../application/interfaces/auth/ILogoutUseCase";
import { IForgotPasswordUseCase } from "../../application/interfaces/auth/IForgotPasswordUseCase";
import { IVerifyForgotOtpUseCase } from "../../application/interfaces/auth/IVerifyForgotOtpUseCase";
import { IResetPasswordUseCase } from "../../application/interfaces/auth/IResetPasswordUseCase";
import { IGoogleLoginUseCase } from "../../application/interfaces/auth/IGoogleLoginUseCase";
import { IRefreshSessionUseCase } from "../../application/interfaces/auth/IRefreshSessionUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/auth/IGetCurrentUserUseCase";
import { IChangePasswordUseCase } from "../../application/interfaces/auth/IChangePasswordUseCase";

import { RegisterDTO } from "../../application/dto/auth/RegisterDTO";
import { LoginDTO } from "../../application/dto/auth/LoginDTO";
import { VerifyOtpDTO } from "../../application/dto/auth/VerifyOtpDTO";
import { ChangePasswordDTO } from "../../application/dto/auth/ChangePasswordDTO";
import { GoogleLoginDTO } from "../../application/dto/auth/GoogleLoginDTO";
import { ForgotPasswordDTO } from "../../application/dto/auth/ForgotPasswordDTO";
import { ResetPasswordDTO } from "../../application/dto/auth/ResetPasswordDTO";


import { UserDTOMapper } from "../../application/mappers/UserDTOMapper";

import { ApiResponse } from "../common/ApiResponse";
import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";



export class AuthController {
  constructor(
    private readonly _registerUseCase: IRegisterUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _loginUseCase: ILoginUseCase,
    private readonly _logoutUseCase: ILogoutUseCase,
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _verifyForgotOtpUseCase: IVerifyForgotOtpUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _googleLoginUseCase: IGoogleLoginUseCase,
    private readonly _refreshSessionUseCase: IRefreshSessionUseCase,
    private readonly _getCurrentUserUseCase: IGetCurrentUserUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase
  ) { }



  register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: RegisterDTO = { username, email, password };

    const result = await this._registerUseCase.execute(dto);

    res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse.success(MESSAGES.AUTH.REGISTER_SUCCESS, {
          userId: result.userId,
        })
      );
  });


  ///
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: VerifyOtpDTO = { userId, otp };

    await this._verifyOtpUseCase.execute(dto);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.AUTH.OTP_VERIFIED));
  });



  ///
  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { userId, ignoreVerified } = req.body;

    if (!userId) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    await this._resendOtpUseCase.execute(userId, { ignoreVerified });

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.AUTH.OTP_RESENT));
  });



  ///
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: LoginDTO = { email, password };

    const result = await this._loginUseCase.execute(dto);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success(MESSAGES.AUTH.LOGIN_SUCCESS, {
        user: UserDTOMapper.toAuth(result.user),
        accessToken: result.accessToken,
      })
    );
  });


  ///
  logout = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as { userId: string; role: "user" | "admin" } | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    await this._logoutUseCase.execute(user.userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.AUTH.LOGOUT_SUCCESS));
  });





  ///
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const dto = new ForgotPasswordDTO(req.body.email);

    const result = await this._forgotPasswordUseCase.execute(dto);

    res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(MESSAGES.AUTH.OTP_SENT, {
          userId: result.userId,
        })
      );
  });



  ///
  verifyForgotOtp = asyncHandler(async (req: Request, res: Response) => {
    const { userId, otp } = req.body;

    await this._verifyForgotOtpUseCase.execute(userId, otp);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.AUTH.OTP_VERIFIED));
  });



  ///
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const dto = new ResetPasswordDTO(
      req.body.userId,
      req.body.password
    );

    await this._resetPasswordUseCase.execute(dto);


    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));
  });



  ///
  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { googleToken } = req.body;

    if (!googleToken) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: GoogleLoginDTO = { googleToken };

    const result = await this._googleLoginUseCase.execute(dto);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success(MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS, {
        user: UserDTOMapper.toAuth(result.user),
        accessToken: result.accessToken,
      })
    );
  });


  ///
  refreshSession = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    const result = await this._refreshSessionUseCase.execute(refreshToken);

    res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success("Session refreshed", {
          accessToken: result.accessToken,
        })
      );
  });



  ///
  me = asyncHandler(async (req: Request, res: Response) => {
    const userContext = res.locals.user as { userId: string; role: "user" | "admin" } | undefined;

    if (!userContext) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const user = await this._getCurrentUserUseCase.execute(userContext.userId);

    res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, {
          user: UserDTOMapper.toResponse(user),
        })
      );
  });


  ///
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userContext = res.locals.user;

    if (!userContext) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: ChangePasswordDTO = {
      userId: userContext.userId,
      currentPassword,
      newPassword,
    };

    await this._changePasswordUseCase.execute(dto);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));
  });



}
