import { Request, Response } from "express";

import { ListUsersUseCase } from "../../application/use-cases/user/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/user/admin/updateUserStatusUseCase";
import { GetAdminDashboardStatsUseCase } from "../../application/use-cases/admin/GetAdminDashboardStatsUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";

import { ListUsersQueryDTO } from "../../application/dto/user/ListUsersQueryDTO";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}


export class AdminController {
  constructor(
    private readonly _listUsersUseCase: ListUsersUseCase,
    private readonly _updateUserStatusUseCase: UpdateUserStatusUseCase,
    private readonly _getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase
  ) { }

  // 
  listUsers = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);


      if (page < 1 || limit < 1 || limit > 100) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const status =
        req.query.status === "active" || req.query.status === "blocked"
          ? req.query.status
          : undefined;

      const dto: ListUsersQueryDTO = {
        page,
        limit,
      };

      if (typeof req.query.search === "string") {
        dto.search = req.query.search;
      }

      if (status) {
        dto.status = status;
      }

      const result = await this._listUsersUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, result));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };



  updateUserStatus = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      const adminUser = res.locals.user as AuthUserContext | undefined;

      if (!adminUser) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      if (status !== "active" && status !== "blocked") {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      await this._updateUserStatusUseCase.execute(
        adminUser.role,
        userId,
        status
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };



  // 
  getDashboardStats = async (req: Request, res: Response) => {
    try {
      const range = typeof req.query.range === "string" ? req.query.range : "30days";

      const stats = await this._getAdminDashboardStatsUseCase.execute(range);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, stats));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };
}