import { Request, Response } from "express";

import { IGetDashboardUseCase } from "../../application/interfaces/user/user/IGetDashboardUseCase";
import { IGetLeaderboardUseCase } from "../../application/interfaces/user/user/IGetLeaderboardUseCase";
import { IUpdateUserAvatarUseCase } from "../../application/interfaces/user/user/IUpdateUserAvatarUseCase";
import { IRemoveUserAvatarUseCase } from "../../application/interfaces/user/user/IRemoveUserAvatarUseCase";
import { IGetUserProfileStatsUseCase } from "../../application/interfaces/user/user/IGetUserProfileStatsUseCase";
import { ICancelPremiumUseCase } from "../../application/interfaces/user/user/ICancelPremiumUseCase";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/user/user/IUpdateUserProfileUseCase";
import { IClaimWelcomeXpUseCase } from "../../application/interfaces/user/user/IClaimWelcomeXpUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { UpdateUserProfileDTO } from "../../application/dto/user/UpdateUserProfileDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";

interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}


export class UserController {
  constructor(
    private readonly _getDashboardUseCase: IGetDashboardUseCase,
    private readonly _getLeaderboardUseCase: IGetLeaderboardUseCase,
    private readonly _updateUserAvatarUseCase: IUpdateUserAvatarUseCase,
    private readonly _removeUserAvatarUseCase: IRemoveUserAvatarUseCase,
    private readonly _getUserProfileStatsUseCase: IGetUserProfileStatsUseCase,
    private readonly _cancelPremiumUseCase: ICancelPremiumUseCase,
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    private readonly _claimWelcomeXpUseCase: IClaimWelcomeXpUseCase
  ) { }

  // Dashboard
  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const data = await this._getDashboardUseCase.execute(user.userId);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, data));
  });


  //
  getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const timeframe =
      req.query.timeframe === "weekly" || req.query.timeframe === "monthly"
        ? (req.query.timeframe as "weekly" | "monthly")
        : "all-time";

    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const result = await this._getLeaderboardUseCase.execute(
      page,
      limit,
      search,
      timeframe
    );

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));
  });


  // 
  updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!req.file) {
      throw new AppError("Avatar image is required", HttpStatus.BAD_REQUEST);
    }

    if (!req.file.mimetype.startsWith("image/")) {
      throw new AppError("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this._updateUserAvatarUseCase.execute(
      user.userId,
      req.file.buffer
    );

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser));
  });


  //
  removeAvatar = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const updatedUser = await this._removeUserAvatarUseCase.execute(user.userId);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser));
  });


  // 
  getProfileStats = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    const targetUserId =
      typeof req.query.userId === "string"
        ? req.query.userId
        : user?.userId;

    if (!targetUserId) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const data =
      await this._getUserProfileStatsUseCase.execute(targetUserId);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, data));
  });


  // 
  cancelPremium = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    await this._cancelPremiumUseCase.execute(user.userId);

    res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success("Premium membership cancelled successfully")
      );
  });


  //
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const dto: UpdateUserProfileDTO = {
      username: req.body.username,
      about: req.body.about,
      github_url: req.body.github_url,
      linkedin_url: req.body.linkedin_url,
    };

    const updatedUser =
      await this._updateUserProfileUseCase.execute(user.userId, dto);

    res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(
          MESSAGES.USER.UPDATE_SUCCESS,
          updatedUser.snapshot()
        )
      );
  });



  // 
  claimWelcomeXp = asyncHandler(async (req: Request, res: Response) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const result = await this._claimWelcomeXpUseCase.execute(user.userId);

    res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(
          result.success
            ? "Welcome XP claimed!"
            : "Welcome XP already claimed",
          result
        )
      );
  });
}