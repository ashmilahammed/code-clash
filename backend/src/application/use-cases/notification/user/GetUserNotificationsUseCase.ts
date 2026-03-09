import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class GetUserNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string, page: number, limit: number) {
    const user = await this.userRepository.findById(userId);
    const isPremium = user?.is_premium || false;

    return await this.notificationRepository.getUserNotifications(
      userId,
      isPremium,
      page,
      limit
    );
  }
}
