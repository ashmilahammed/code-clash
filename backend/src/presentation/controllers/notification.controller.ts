import { Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { ApiResponse } from "../common/ApiResponse";

import { SendNotificationUseCase } from "../../application/use-cases/notification/admin/SendNotificationUseCase";
import { GetAdminNotificationHistoryUseCase } from "../../application/use-cases/notification/admin/GetAdminNotificationHistoryUseCase";
import { GetUserNotificationsUseCase } from "../../application/use-cases/notification/user/GetUserNotificationsUseCase";
import { MarkNotificationReadUseCase } from "../../application/use-cases/notification/user/MarkNotificationReadUseCase";
import { MarkAllReadUseCase } from "../../application/use-cases/notification/user/MarkAllReadUseCase";
import { ClearNotificationsUseCase } from "../../application/use-cases/notification/user/ClearNotificationsUseCase";

import { SendNotificationDTO } from "../../application/dto/notification/SendNotificationDTO";
import { AdminNotificationHistoryQueryDTO } from "../../application/dto/notification/AdminNotificationHistoryQueryDTO";
import { UserNotificationsQueryDTO } from "../../application/dto/notification/UserNotificationsQueryDTO";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
  is_premium?: boolean;
}

export class NotificationController {
  constructor(
    private readonly _sendNotificationUseCase: SendNotificationUseCase,
    private readonly _getAdminNotificationHistoryUseCase: GetAdminNotificationHistoryUseCase,
    private readonly _getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly _markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly _markAllReadUseCase: MarkAllReadUseCase,
    private readonly _clearNotificationsUseCase: ClearNotificationsUseCase
  ) { }


  //admin

  sendNotification = async (req: Request, res: Response) => {
    try {
      const { title, message, recipientType } = req.body;
      const userContext = res.locals.user as AuthUserContext;

      if (!title || !message || !recipientType) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: SendNotificationDTO = {
        title,
        message,
        recipientType,
        senderId: userContext.userId,
      };

      await this._sendNotificationUseCase.execute(dto);

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success(MESSAGES.NOTIFICATION.SENT));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };



  getAdminHistory = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const dto: AdminNotificationHistoryQueryDTO = {
        page,
        limit,
      };

      const result = await this._getAdminNotificationHistoryUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.NOTIFICATION.FETCH_SUCCESS, result));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };



  // user

  getUserNotifications = async (req: Request, res: Response) => {
    try {
      const userContext = res.locals.user as AuthUserContext;

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const dto: UserNotificationsQueryDTO = {
        userId: userContext.userId,
        page,
        limit,
      };

      const result = await this._getUserNotificationsUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.NOTIFICATION.FETCH_SUCCESS, result.data));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };


  markAsRead = async (req: Request, res: Response) => {
    try {

      const userContext = res.locals.user as AuthUserContext;
      const { notificationId } = req.params;

      if (!notificationId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.NOTIFICATION.ID_REQUIRED));
      }

      await this._markNotificationReadUseCase.execute(userContext.userId, notificationId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.NOTIFICATION.MARKED_READ));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };



  markAllAsRead = async (req: Request, res: Response) => {
    try {
      const userContext = res.locals.user as AuthUserContext;

      await this._markAllReadUseCase.execute(
        userContext.userId,
        !!userContext.is_premium
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.NOTIFICATION.MARKED_ALL_READ));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };



  clearNotifications = async (req: Request, res: Response) => {
    try {
      const userContext = res.locals.user as AuthUserContext;

      await this._clearNotificationsUseCase.execute(userContext.userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.NOTIFICATION.CLEARED));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };
}