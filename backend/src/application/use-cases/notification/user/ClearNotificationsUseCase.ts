import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class ClearNotificationsUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(userId: string) {
    return await this.notificationRepository.clearNotifications(userId);
  }
}
