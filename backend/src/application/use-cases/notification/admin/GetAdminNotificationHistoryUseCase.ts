import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";

export class GetAdminNotificationHistoryUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute(page: number, limit: number) {
    return await this.notificationRepository.getAdminHistory(page, limit);
  }
}
