import { Notification } from "../../entities/notification/Notification";

export interface IUserNotificationDetail {
  id: string; // or Types.ObjectId depending on how it's mapped, but string is better
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface INotificationRepository {
  createNotification(notification: Partial<Notification>): Promise<Notification>;
  getAdminHistory(page: number, limit: number): Promise<{ data: Notification[]; total: number }>;
  getUserNotifications(userId: string, isPremium: boolean, dateJoined: Date, page: number, limit: number): Promise<{ data: IUserNotificationDetail[]; total: number }>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
  markAllAsRead(userId: string, isPremium: boolean, dateJoined: Date): Promise<void>;
  clearNotifications(userId: string, isPremium: boolean, dateJoined: Date): Promise<void>;
}
