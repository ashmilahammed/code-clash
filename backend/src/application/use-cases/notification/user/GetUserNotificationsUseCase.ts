import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { UserNotificationsQueryDTO } from "../../../dto/notification/UserNotificationsQueryDTO";

export class GetUserNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(dto: UserNotificationsQueryDTO) {
    const { userId, page, limit } = dto;

    const user = await this._userRepository.findById(userId);
    const isPremium = user?.is_premium ?? false;

    return await this._notificationRepository.getUserNotifications(
      userId,
      isPremium,
      page,
      limit
    );
  }
}