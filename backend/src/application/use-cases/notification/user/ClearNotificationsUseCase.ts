import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class ClearNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string) {
    return await this._notificationRepository.clearNotifications(userId);
  }
}
