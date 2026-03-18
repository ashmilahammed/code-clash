import { INotificationRepository } from "../../../domain/repositories/notification/INotificationRepository";
import { Notification } from "../../../domain/entities/notification/Notification";
import { NotificationModel, INotificationDoc } from "../../database/models/notification/NotificationModel";
import { UserNotificationModel } from "../../database/models/notification/UserNotificationModel";
import { BaseRepository } from "../BaseRepository";

import mongoose from "mongoose";


export class NotificationRepository extends BaseRepository<INotificationDoc>
  implements INotificationRepository {

  constructor() {
    super(NotificationModel);
  }

  private toDomain(doc: INotificationDoc): Notification {
    return new Notification(
      doc._id.toString(),
      doc.title,
      doc.message,
      doc.recipientType,
      doc.senderId.toString(),
      doc.createdAt,
      doc.recipientId?.toString()
    );
  }

  // async createNotification(notification: Partial<Notification>): Promise<Notification> {
  //   const created = await this.createRaw(notification);
  //   return this.toDomain(created);
  // }

  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    const created = await this.createRaw({
      ...notification,
      senderId: new mongoose.Types.ObjectId(notification.senderId),
      recipientId: notification.recipientId ? new mongoose.Types.ObjectId(notification.recipientId) : undefined,
    } as Partial<INotificationDoc>);

    return this.toDomain(created);
  }


  async getAdminHistory(
    page: number,
    limit: number
  ): Promise<{ data: Notification[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.findManyRaw({}, skip, limit, { createdAt: -1 }),
      this.count({}),
    ]);

    return {
      data: docs.map((d) => this.toDomain(d)),
      total,
    };
  }

  async getUserNotifications(
    userId: string,
    isPremium: boolean,
    page: number,
    limit: number
  ): Promise<{ data: any[]; total: number }> {
    const recipientTypes = ["all", isPremium ? "premium" : "normal"];

    const skip = (page - 1) * limit;

    // Get all notifications for this user segment
    const notifications = await NotificationModel.find({
      $or: [
        { recipientType: { $in: recipientTypes } },
        { recipientType: "individual", recipientId: new mongoose.Types.ObjectId(userId) }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NotificationModel.countDocuments({
      $or: [
        { recipientType: { $in: recipientTypes } },
        { recipientType: "individual", recipientId: new mongoose.Types.ObjectId(userId) }
      ]
    });

    // Get read/cleared status for these notifications
    const userStatuses = await UserNotificationModel.find({
      userId,
      notificationId: { $in: notifications.map((n) => n._id) },
    });

    const statusMap = new Map(
      userStatuses.map((s) => [s.notificationId.toString(), s])
    );

    const data = notifications
      .map((n) => {
        const status = statusMap.get(n._id.toString());
        if (status?.isCleared) return null;
        return {
          id: n._id,
          title: n.title,
          message: n.message,
          createdAt: n.createdAt,
          isRead: status?.isRead || false,
        };
      })
      .filter((n) => n !== null);

    return { data, total };
  }


  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await UserNotificationModel.updateOne(
      { userId, notificationId },
      { $set: { isRead: true } },
      { upsert: true }
    );
  }

  async markAllAsRead(userId: string, isPremium: boolean): Promise<void> {
    const recipientTypes = ["all", isPremium ? "premium" : "normal"];

    // Find all notifications that match the user's segment
    const notifications = await NotificationModel.find({
      $or: [
        { recipientType: { $in: recipientTypes } },
        { recipientType: "individual", recipientId: new mongoose.Types.ObjectId(userId) }
      ]
    }).select("_id");

    if (notifications.length === 0) return;

    const ops = notifications.map((n) => ({
      updateOne: {
        filter: { userId: new mongoose.Types.ObjectId(userId), notificationId: n._id },
        update: { $set: { isRead: true } },
        upsert: true,
      },
    }));

    await UserNotificationModel.bulkWrite(ops);
  }

  async clearNotifications(userId: string): Promise<void> {
    // Similar to markAllAsRead, but setting isCleared
    await UserNotificationModel.updateMany(
      { userId },
      { $set: { isCleared: true, isRead: true } }
    );
  }
}
