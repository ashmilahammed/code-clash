import { Request, Response } from "express";
import { GetDashboardUseCase } from "../../application/use-cases/user/user/getDashboardUseCase";
import { GetLeaderboardUseCase } from "../../application/use-cases/user/user/getLeaderboardUseCase";
import { UpdateUserAvatarUseCase } from "../../application/use-cases/user/user/updateUserAvatarUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


export class UserController {
  constructor(
    private readonly _getDashboardUseCase: GetDashboardUseCase,
    private readonly _getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly _updateUserAvatarUseCase: UpdateUserAvatarUseCase
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
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const users = await this._getLeaderboardUseCase.execute(limit);

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




}

