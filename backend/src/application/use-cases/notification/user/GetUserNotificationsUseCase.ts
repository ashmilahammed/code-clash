import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { UserNotificationsQueryDTO } from "../../../dto/notification/UserNotificationsQueryDTO";

import { IGetUserNotificationsUseCase } from "../../../interfaces/notification/user/IGetUserNotificationsUseCase";


export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
    private readonly _userRepository: IUserRepository
  ) { }

  async execute(dto: UserNotificationsQueryDTO) {
    const { userId, page, limit } = dto;

    // const user = await this._userRepository.findById(userId);
    // const isPremium = user?.is_premium ?? false;
    // const dateJoined = user?.date_joined ?? new Date();

    // return await this._notificationRepository.getUserNotifications(
    //   userId,
    //   isPremium,
    //   dateJoined,
    //   page,
    //   limit
    // );

    const user = await this._userRepository.findById(userId);

    const isPremium = user?.is_premium ?? false;
    const dateJoined = user?.date_joined ?? new Date();

    const { data, total } =
      await this._notificationRepository.getUserNotifications(
        userId,
        isPremium,
        dateJoined,
        page,
        limit
      );

    const unreadCount = data.filter((n: { isRead?: boolean }) => !n.isRead).length;

    return {
      notifications: data,
      unreadCount,
      total,
      totalPages: Math.ceil(total / limit),
    };

  }
}