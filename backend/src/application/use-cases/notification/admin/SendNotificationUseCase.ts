import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { ISendNotificationUseCase } from "../../../interfaces/notification/admin/ISendNotificationUseCase";


export class SendNotificationUseCase implements ISendNotificationUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) { }

  async execute(data: {
    title: string;
    message: string;
    recipientType: "all" | "normal" | "premium";
    senderId: string;
  }) {
    return await this._notificationRepository.createNotification(data);
  }
}
