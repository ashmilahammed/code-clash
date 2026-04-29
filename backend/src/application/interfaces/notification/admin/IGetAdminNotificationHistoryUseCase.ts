import { AdminNotificationHistoryQueryDTO } from "../../../dto/notification/AdminNotificationHistoryQueryDTO";
import { Notification } from "../../../../domain/entities/notification/Notification";

export interface IGetAdminNotificationHistoryUseCase {
  execute(dto: AdminNotificationHistoryQueryDTO): Promise<{
    notifications: Notification[];
    total: number;
    totalPages: number;
  }>;
}
