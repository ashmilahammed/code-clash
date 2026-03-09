import { Notification } from "../../entities/notification/Notification";

export interface INotificationRepository {
  createNotification(notification: Partial<Notification>): Promise<Notification>;
  getAdminHistory(page: number, limit: number): Promise<{ data: Notification[]; total: number }>;
  getUserNotifications(userId: string, isPremium: boolean, page: number, limit: number): Promise<{ data: any[]; total: number }>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  clearNotifications(userId: string): Promise<void>;
}
