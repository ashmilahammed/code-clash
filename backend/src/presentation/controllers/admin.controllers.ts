import { Request, Response } from "express";

import { ListUsersUseCase } from "../../application/use-cases/user/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/user/admin/updateUserStatusUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";



interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}

export class AdminController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserStatusUseCase: UpdateUserStatusUseCase
  ) { }



  ///
  // listUsers = async (req: Request, res: Response) => {
  //   try {
  //     const page = Number(req.query.page ?? 1);
  //     const limit = Number(req.query.limit ?? 10);

  //     const status =
  //       req.query.status === "active" || req.query.status === "blocked"
  //         ? req.query.status
  //         : undefined;

  //     const result = await this.listUsersUseCase.execute(
  //       page,
  //       limit,
  //       status
  //     );

  //     return res
  //       .status(HttpStatus.OK)
  //       .json(ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, result));

  //   } catch (err: unknown) {
  //     const message =
  //       err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

  //     return res
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .json(ApiResponse.error(message));
  //   }
  // };


  listUsers = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const status =
        req.query.status === "active" || req.query.status === "blocked"
          ? req.query.status
          : undefined;

      const query: any = {
        page,
        limit,
      };

      if (typeof req.query.search === "string") {
        query.search = req.query.search;
      }

      if (status) {
        // query.filters = { status };
        query.status = status;
      }

      const result = await this.listUsersUseCase.execute(query);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.FETCH_SUCCESS, result));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
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

      await this.updateUserStatusUseCase.execute(
        adminUser.role,
        userId,
        status
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.USER.UPDATE_SUCCESS));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };
}






