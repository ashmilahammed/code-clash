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

export class NotificationController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly getAdminNotificationHistoryUseCase: GetAdminNotificationHistoryUseCase,
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllReadUseCase: MarkAllReadUseCase,
    private readonly clearNotificationsUseCase: ClearNotificationsUseCase
  ) { }

  // Admin
  sendNotification = async (req: Request, res: Response) => {
    try {
      const { title, message, recipientType } = req.body;
      const senderId = (res.locals.user as any).userId;

      if (!title || !message || !recipientType) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      await this.sendNotificationUseCase.execute({
        title,
        message,
        recipientType,
        senderId,
      });

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success("Notification sent successfully"));
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
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const result = await this.getAdminNotificationHistoryUseCase.execute(
        page,
        limit
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };

  // User
  getUserNotifications = async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.user as any;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const result = await this.getUserNotificationsUseCase.execute(
        userId,
        page,
        limit
      );

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));
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
      const { userId } = res.locals.user as any;
      const { notificationId } = req.params;

      if (!notificationId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error("Notification id is required"));
      }

      await this.markNotificationReadUseCase.execute(userId, notificationId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Notification marked as read"));
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
      const { userId, is_premium } = res.locals.user as any;

      await this.markAllReadUseCase.execute(userId, !!is_premium);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("All notifications marked as read"));
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
      const { userId } = res.locals.user as any;

      await this.clearNotificationsUseCase.execute(userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Notifications cleared"));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };
}
