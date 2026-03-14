import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { AdminNotificationHistoryQueryDTO } from "../../../dto/notification/AdminNotificationHistoryQueryDTO";


export class GetAdminNotificationHistoryUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(dto: AdminNotificationHistoryQueryDTO) {
    const { page, limit } = dto;

    return await this._notificationRepository.getAdminHistory(
      page,
      limit
    );
  }
}