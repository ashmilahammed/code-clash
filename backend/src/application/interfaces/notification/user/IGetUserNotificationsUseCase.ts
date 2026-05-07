import { UserNotificationsQueryDTO } from "../../../dto/notification/UserNotificationsQueryDTO";
import { IUserNotificationDetail } from "../../../../domain/repositories/notification/INotificationRepository";

export interface IGetUserNotificationsUseCase {
  execute(dto: UserNotificationsQueryDTO): Promise<{
    notifications: IUserNotificationDetail[];
    unreadCount: number;
    total: number;
    totalPages: number;
  }>;
}
