import { Request, Response } from "express";

import { GetDashboardUseCase } from "../../application/use-cases/user/user/getDashboardUseCase";
import { GetLeaderboardUseCase } from "../../application/use-cases/user/user/getLeaderboardUseCase";
import { UpdateUserAvatarUseCase } from "../../application/use-cases/user/user/updateUserAvatarUseCase";
import { RemoveUserAvatarUseCase } from "../../application/use-cases/user/user/removeUserAvatarUseCase";
import { GetUserProfileStatsUseCase } from "../../application/use-cases/user/user/getUserProfileStatsUseCase";
import { CancelPremiumUseCase } from "../../application/use-cases/user/user/CancelPremiumUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/user/user/UpdateUserProfileUseCase";
import { ClaimWelcomeXpUseCase } from "../../application/use-cases/user/user/ClaimWelcomeXpUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { UpdateUserProfileDTO } from "../../application/dto/user/UpdateUserProfileDTO";
import { LeaderboardQueryDTO } from "../../application/dto/user/LeaderboardQueryDTO";

interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}


export class UserController {
  constructor(
    private readonly _getDashboardUseCase: GetDashboardUseCase,
    private readonly _getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly _updateUserAvatarUseCase: UpdateUserAvatarUseCase,
    private readonly _removeUserAvatarUseCase: RemoveUserAvatarUseCase,
    private readonly _getUserProfileStatsUseCase: GetUserProfileStatsUseCase,
    private readonly _cancelPremiumUseCase: CancelPremiumUseCase,
    private readonly _updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly _claimWelcomeXpUseCase: ClaimWelcomeXpUseCase
  ) { }

  // Dashboard
  getDashboard = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const data = await this._getDashboardUseCase.execute(user.userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, data));
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };


  //
  getLeaderboard = async (req: Request, res: Response) => {
    try {
      const dto: LeaderboardQueryDTO = {
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 10),
        timeframe:
          req.query.timeframe === "weekly" || req.query.timeframe === "monthly"
            ? req.query.timeframe
            : "all-time",
      };

      // add search ONLY if exists
      if (typeof req.query.search === "string" && req.query.search.trim() !== "") {
        dto.search = req.query.search;
      }

      const result = await this._getLeaderboardUseCase.execute(
        dto.page,
        dto.limit,
        dto.search,
        dto.timeframe
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Leaderboard fetched successfully", result));
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };


  // 
  updateAvatar = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      if (!req.file) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error("Avatar image is required"));
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error("Invalid file type"));
      }

      const updatedUser = await this._updateUserAvatarUseCase.execute(
        user.userId,
        req.file.buffer
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser));
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };


  //
  removeAvatar = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const updatedUser = await this._removeUserAvatarUseCase.execute(user.userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };


  // 
  getProfileStats = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      const targetUserId =
        typeof req.query.userId === "string"
          ? req.query.userId
          : user?.userId;

      if (!targetUserId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const data =
        await this._getUserProfileStatsUseCase.execute(targetUserId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Profile stats fetched successfully", data));
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };


  // 
  cancelPremium = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      await this._cancelPremiumUseCase.execute(user.userId);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Premium membership cancelled successfully")
        );
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };


  //
  updateProfile = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const dto: UpdateUserProfileDTO = {
        username: req.body.username,
        about: req.body.about,
        github_url: req.body.github_url,
        linkedin_url: req.body.linkedin_url,
      };

      const updatedUser =
        await this._updateUserProfileUseCase.execute(user.userId, dto);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(
            MESSAGES.USER.UPDATE_SUCCESS,
            updatedUser.snapshot()
          )
        );
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };



  // 
  claimWelcomeXp = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const result = await this._claimWelcomeXpUseCase.execute(user.userId);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(
            result.success
              ? "Welcome XP claimed!"
              : "Welcome XP already claimed",
            result
          )
        );
    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };
}