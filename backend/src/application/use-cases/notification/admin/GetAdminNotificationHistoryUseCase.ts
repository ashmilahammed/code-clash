import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { AdminNotificationHistoryQueryDTO } from "../../../dto/notification/AdminNotificationHistoryQueryDTO";
import { IGetAdminNotificationHistoryUseCase } from "../../../interfaces/notification/admin/IGetAdminNotificationHistoryUseCase";


export class GetAdminNotificationHistoryUseCase implements IGetAdminNotificationHistoryUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) { }

  async execute(dto: AdminNotificationHistoryQueryDTO) {
    const { page, limit } = dto;

    // return await this._notificationRepository.getAdminHistory(
    //   page,
    //   limit
    // );
    const { data, total } =
      await this._notificationRepository.getAdminHistory(page, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications: data,
      total,
      totalPages,
    };
  }
}