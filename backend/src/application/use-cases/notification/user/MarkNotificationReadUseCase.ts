import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class MarkNotificationReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string, notificationId: string) {
    return await this._notificationRepository.markAsRead(userId, notificationId);
  }
}
