import { UserNotificationsQueryDTO } from "../../../dto/notification/UserNotificationsQueryDTO";
import { Notification } from "../../../../domain/entities/notification/Notification";

export interface IGetUserNotificationsUseCase {
  execute(dto: UserNotificationsQueryDTO): Promise<{
    notifications: Notification[];
    unreadCount: number;
    total: number;
    totalPages: number;
  }>;
}
