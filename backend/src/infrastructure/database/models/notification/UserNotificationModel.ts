import mongoose, { Schema, Document } from "mongoose";

export interface IUserNotificationDoc extends Document {
  userId: mongoose.Types.ObjectId;
  notificationId: mongoose.Types.ObjectId;
  isRead: boolean;
  isCleared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSchema = new Schema<IUserNotificationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    isRead: { type: Boolean, default: false },
    isCleared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for faster lookups
UserNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });

export const UserNotificationModel = mongoose.model<IUserNotificationDoc>(
  "UserNotification",
  UserNotificationSchema
);
