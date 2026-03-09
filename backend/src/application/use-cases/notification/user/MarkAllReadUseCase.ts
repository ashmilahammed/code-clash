import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class MarkAllReadUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(userId: string) {
    return await this.notificationRepository.markAllAsRead(userId);
  }
}
