import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class MarkAllReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
    private readonly _userRepository: IUserRepository
  ) { }

  async execute(userId: string, isPremium: boolean) {
    const user = await this._userRepository.findById(userId);
    const dateJoined = user?.date_joined ?? new Date();

    return await this._notificationRepository.markAllAsRead(userId, isPremium, dateJoined);
  }
}
