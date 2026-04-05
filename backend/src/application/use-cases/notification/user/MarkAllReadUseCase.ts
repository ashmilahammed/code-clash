import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class MarkAllReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
    private readonly _userRepository: IUserRepository
  ) { }

  async execute(userId: string) {
    const user = await this._userRepository.findById(userId);
    const dateJoined = user?.date_joined ?? new Date();
    const isPremium = user?.is_premium ?? false;

    return await this._notificationRepository.markAllAsRead(userId, isPremium, dateJoined);
  }
}
