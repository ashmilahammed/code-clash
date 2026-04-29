import { Notification } from "../../../../domain/entities/notification/Notification";

export interface ISendNotificationUseCase {
  execute(data: {
    title: string;
    message: string;
    recipientType: "all" | "normal" | "premium";
    senderId: string;
  }): Promise<Notification>;
}
