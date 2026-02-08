import { Request, Response } from "express";
import { GetDashboardUseCase } from "../../application/use-cases/user/getDashboardUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


export class UserController {
  constructor(
    private readonly _getDashboardUseCase: GetDashboardUseCase
  ) {}

  
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
}
