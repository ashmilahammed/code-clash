import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class SendNotificationUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(data: {
    title: string;
    message: string;
    recipientType: "all" | "normal" | "premium";
    senderId: string;
  }) {
    return await this.notificationRepository.createNotification(data);
  }
}
