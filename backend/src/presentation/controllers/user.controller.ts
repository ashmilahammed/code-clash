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


  getDashboard = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };

      if (!authUser?.userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const data = await this._getDashboardUseCase.execute(authUser.userId);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, data)
        );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };



  getLeaderboard = async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search ? (req.query.search as string) : "";
      const rawTimeframe = req.query.timeframe as string;

      const timeframe: "all-time" | "weekly" | "monthly" =
        ["weekly", "monthly"].includes(rawTimeframe)
          ? (rawTimeframe as "weekly" | "monthly")
          : "all-time";

      const users = await this._getLeaderboardUseCase.execute(page, limit, search, timeframe);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Leaderboard fetched successfully", users));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };







  updateAvatar = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };

      if (!authUser?.userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      if (!req.file) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error("No file uploaded"));
      }

      const updatedUser =
        await this._updateUserAvatarUseCase.execute(
          authUser.userId,
          req.file.buffer
        );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser));

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };



  removeAvatar = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };

      if (!authUser?.userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const updatedUser = await this._removeUserAvatarUseCase.execute(authUser.userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser));

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };

  getProfileStats = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };
      const targetUserId = (req.query.userId as string) || authUser?.userId;

      if (!targetUserId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const data = await this._getUserProfileStatsUseCase.execute(targetUserId);

      return res
        .status(HttpStatus.OK)
        .json(
          ApiResponse.success("Profile stats fetched successfully", data)
        );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };

  cancelPremium = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };

      if (!authUser?.userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      await this._cancelPremiumUseCase.execute(authUser.userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Premium membership cancelled successfully"));

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };


  updateProfile = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };

      if (!authUser?.userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const { username, about, github_url, linkedin_url } = req.body;

      const updatedUser = await this._updateUserProfileUseCase.execute(authUser.userId, {
        username,
        about,
        github_url,
        linkedin_url
      });

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS, updatedUser.snapshot()));

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };

  claimWelcomeXp = async (req: Request, res: Response) => {
    try {
      const authUser = res.locals.user as { userId: string };

      if (!authUser?.userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      // Execute the use case which handles the DB update
      const result = await this._claimWelcomeXpUseCase.execute(authUser.userId);

      if (result.success) {
        return res.status(HttpStatus.OK).json(ApiResponse.success("Welcome XP claimed!", result));
      } else {
        return res.status(HttpStatus.OK).json(ApiResponse.success("Welcome XP already claimed", result));
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
    }
  };

}
