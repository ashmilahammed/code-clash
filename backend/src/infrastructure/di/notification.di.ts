import { NotificationRepository } from "../repositories/notification/NotificationRepository";

import { SendNotificationUseCase } from "../../application/use-cases/notification/admin/SendNotificationUseCase";
import { GetAdminNotificationHistoryUseCase } from "../../application/use-cases/notification/admin/GetAdminNotificationHistoryUseCase";

import { GetUserNotificationsUseCase } from "../../application/use-cases/notification/user/GetUserNotificationsUseCase";
import { MarkNotificationReadUseCase } from "../../application/use-cases/notification/user/MarkNotificationReadUseCase";
import { MarkAllReadUseCase } from "../../application/use-cases/notification/user/MarkAllReadUseCase";
import { ClearNotificationsUseCase } from "../../application/use-cases/notification/user/ClearNotificationsUseCase";

import { NotificationController } from "../../presentation/controllers/notification.controller";
import { userRepository } from "./user.di";

// Repositories
export const notificationRepository = new NotificationRepository();

// Use Cases - Admin
const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
const getAdminNotificationHistoryUseCase = new GetAdminNotificationHistoryUseCase(notificationRepository);

// Use Cases - User
const getUserNotificationsUseCase = new GetUserNotificationsUseCase(notificationRepository, userRepository);
const markNotificationReadUseCase = new MarkNotificationReadUseCase(notificationRepository);
const markAllReadUseCase = new MarkAllReadUseCase(notificationRepository, userRepository);
const clearNotificationsUseCase = new ClearNotificationsUseCase(notificationRepository);

// Controller
export const notificationController = new NotificationController(
  sendNotificationUseCase,
  getAdminNotificationHistoryUseCase,
  getUserNotificationsUseCase,
  markNotificationReadUseCase,
  markAllReadUseCase,
  clearNotificationsUseCase
);
