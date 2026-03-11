import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDoc extends Document {
  title: string;
  message: string;
  recipientType: "all" | "normal" | "premium" | "individual";
  senderId: mongoose.Types.ObjectId;
  recipientId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipientType: {
      type: String,
      enum: ["all", "normal", "premium", "individual"],
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotificationDoc>(
  "Notification",
  NotificationSchema
);
