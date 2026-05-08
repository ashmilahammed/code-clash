import { Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { ApiResponse } from "../common/ApiResponse";

import { ISendNotificationUseCase } from "../../application/interfaces/notification/admin/ISendNotificationUseCase";
import { IGetAdminNotificationHistoryUseCase } from "../../application/interfaces/notification/admin/IGetAdminNotificationHistoryUseCase";
import { IGetUserNotificationsUseCase } from "../../application/interfaces/notification/user/IGetUserNotificationsUseCase";
import { IMarkNotificationReadUseCase } from "../../application/interfaces/notification/user/IMarkNotificationReadUseCase";
import { IMarkAllReadUseCase } from "../../application/interfaces/notification/user/IMarkAllReadUseCase";
import { IClearNotificationsUseCase } from "../../application/interfaces/notification/user/IClearNotificationsUseCase";

import { SendNotificationDTO } from "../../application/dto/notification/SendNotificationDTO";
import { AdminNotificationHistoryQueryDTO } from "../../application/dto/notification/AdminNotificationHistoryQueryDTO";
import { UserNotificationsQueryDTO } from "../../application/dto/notification/UserNotificationsQueryDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
  is_premium?: boolean;
}

export class NotificationController {
  constructor(
    private readonly _sendNotificationUseCase: ISendNotificationUseCase,
    private readonly _getAdminNotificationHistoryUseCase: IGetAdminNotificationHistoryUseCase,
    private readonly _getUserNotificationsUseCase: IGetUserNotificationsUseCase,
    private readonly _markNotificationReadUseCase: IMarkNotificationReadUseCase,
    private readonly _markAllReadUseCase: IMarkAllReadUseCase,
    private readonly _clearNotificationsUseCase: IClearNotificationsUseCase
  ) { }



  sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { title, message, recipientType } = req.body;
    const userContext = res.locals.user as AuthUserContext;

    if (!title || !message || !recipientType) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: SendNotificationDTO = {
      title,
      message,
      recipientType,
      senderId: userContext.userId,
    };

    await this._sendNotificationUseCase.execute(dto);

    res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(MESSAGES.NOTIFICATION.SENT));
  });



  getAdminHistory = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const dto: AdminNotificationHistoryQueryDTO = {
      page,
      limit,
    };

    const result = await this._getAdminNotificationHistoryUseCase.execute(dto);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.NOTIFICATION.FETCH_SUCCESS, result));
  });



  getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userContext = res.locals.user as AuthUserContext;

    if (!userContext) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const dto: UserNotificationsQueryDTO = {
      userId: userContext.userId,
      page,
      limit,
    };

    const result = await this._getUserNotificationsUseCase.execute(dto);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.NOTIFICATION.FETCH_SUCCESS, result));
  });


  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userContext = res.locals.user as AuthUserContext;
    const { notificationId } = req.params;

    if (!notificationId) {
      throw new AppError(MESSAGES.NOTIFICATION.ID_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    await this._markNotificationReadUseCase.execute(userContext.userId, notificationId);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.NOTIFICATION.MARKED_READ));
  });



  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userContext = res.locals.user as AuthUserContext;

    await this._markAllReadUseCase.execute(
      userContext.userId
    );

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.NOTIFICATION.MARKED_ALL_READ));
  });



  clearNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userContext = res.locals.user as AuthUserContext;

    await this._clearNotificationsUseCase.execute(userContext.userId);

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.NOTIFICATION.CLEARED));
  });
}