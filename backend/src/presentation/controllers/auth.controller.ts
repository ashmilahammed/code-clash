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


import { UserMapper } from "../../application/mappers/UserMapper";

import { ApiResponse } from "../common/ApiResponse";
import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";



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



  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: RegisterDTO = { username, email, password };

      const result = await this._registerUseCase.execute(dto);

      return res
        .status(HttpStatus.CREATED)
        .json(
          ApiResponse.success(MESSAGES.AUTH.REGISTER_SUCCESS, {
            userId: result.userId,
          })
        );
    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
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

      const dto: VerifyOtpDTO = { userId, otp };

      await this._verifyOtpUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.OTP_VERIFIED));
    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
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

      await this._resendOtpUseCase.execute(userId, { ignoreVerified });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.OTP_RESENT));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };



  ///
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: LoginDTO = { email, password };

      const result = await this._loginUseCase.execute(dto);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(HttpStatus.OK).json(
        ApiResponse.success(MESSAGES.AUTH.LOGIN_SUCCESS, {
          user: UserMapper.toAuth(result.user),
          accessToken: result.accessToken,
        })
      );
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };


  ///
  logout = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as { userId: string; role: "user" | "admin" } | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      await this._logoutUseCase.execute(user.userId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.LOGOUT_SUCCESS));


    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };





  ///
  forgotPassword = async (req: Request, res: Response) => {
    try {

      const dto = new ForgotPasswordDTO(req.body.email);

      const result = await this._forgotPasswordUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.AUTH.OTP_SENT, {
            userId: result.userId,
          })
        );

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };



  ///
  verifyForgotOtp = async (req: Request, res: Response) => {
    try {
      const { userId, otp } = req.body;

      await this._verifyForgotOtpUseCase.execute(userId, otp);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.AUTH.OTP_VERIFIED));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };



  ///
  resetPassword = async (req: Request, res: Response) => {
    try {
      // const { userId, password } = req.body;
      // await this._resetPasswordUseCase.execute(userId, password);

      const dto = new ResetPasswordDTO(
        req.body.userId,
        req.body.password
      );

      await this._resetPasswordUseCase.execute(dto);


      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
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

      const dto: GoogleLoginDTO = { googleToken };

      const result = await this._googleLoginUseCase.execute(dto);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(HttpStatus.OK).json(
        ApiResponse.success(MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS, {
          user: UserMapper.toAuth(result.user),
          accessToken: result.accessToken,
        })
      );

    } catch (err: unknown) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.AUTH.UNAUTHORIZED));
    }
  };


  ///
  refreshSession = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      const result = await this._refreshSessionUseCase.execute(refreshToken);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Session refreshed", {
            accessToken: result.accessToken,
          })
        );

    } catch (err: unknown) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.AUTH.UNAUTHORIZED));
    }
  };



  ///
  me = async (req: Request, res: Response) => {
    try {
      const userContext = res.locals.user as { userId: string; role: "user" | "admin" } | undefined;

      if (!userContext) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const user = await this._getCurrentUserUseCase.execute(userContext.userId);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, {
            // user
            user: UserMapper.toResponse(user),
          })
        );

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };


  ///
  changePassword = async (req: Request, res: Response) => {
    try {
      const userContext = res.locals.user;

      if (!userContext) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: ChangePasswordDTO = {
        userId: userContext.userId,
        currentPassword,
        newPassword,
      };

      await this._changePasswordUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));
    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };



}