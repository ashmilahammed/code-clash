import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class MarkAllReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string, isPremium: boolean) {
    return await this._notificationRepository.markAllAsRead(userId, isPremium);
  }
}
