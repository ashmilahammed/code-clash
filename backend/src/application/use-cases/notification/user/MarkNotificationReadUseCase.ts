import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(userId: string, notificationId: string) {
    return await this.notificationRepository.markAsRead(userId, notificationId);
  }
}
