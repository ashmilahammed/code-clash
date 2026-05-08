import { Request, Response } from "express";

import { IListUsersUseCase } from "../../application/interfaces/user/admin/IListUsersUseCase";
import { IUpdateUserStatusUseCase } from "../../application/interfaces/user/admin/IUpdateUserStatusUseCase";
import { IGetAdminDashboardStatsUseCase } from "../../application/interfaces/admin-Dashboard/IGetAdminDashboardStatsUseCase";
import { IGetUserSolvedCountUseCase } from "../../application/interfaces/user/admin/IGetUserSolvedCountUseCase";
import { ApiResponse } from "../common/ApiResponse";
import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";

import { ListUsersQueryDTO } from "../../application/dto/user/ListUsersQueryDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}


export class AdminController {
  constructor(
    private readonly _listUsersUseCase: IListUsersUseCase,
    private readonly _updateUserStatusUseCase: IUpdateUserStatusUseCase,
    private readonly _getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
    private readonly _getUserSolvedCountUseCase: IGetUserSolvedCountUseCase
  ) { }


  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);


    if (page < 1 || limit < 1 || limit > 100) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
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

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, result));
  });



  updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;

    const adminUser = res.locals.user as AuthUserContext | undefined;

    if (!adminUser) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!userId) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    if (status !== "active" && status !== "blocked") {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    await this._updateUserStatusUseCase.execute(
      adminUser.role,
      userId,
      status
    );

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));
  });



  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const range = typeof req.query.range === "string" ? req.query.range : "30days";

    const stats = await this._getAdminDashboardStatsUseCase.execute(range);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, stats));
  });



  getUserSolvedCount = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const stats = await this._getUserSolvedCountUseCase.execute(userId);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, stats));
  });
}




