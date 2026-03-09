import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDoc extends Document {
  title: string;
  message: string;
  recipientType: "all" | "normal" | "premium";
  senderId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipientType: {
      type: String,
      enum: ["all", "normal", "premium"],
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotificationDoc>(
  "Notification",
  NotificationSchema
);
