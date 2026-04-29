import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { IMarkNotificationReadUseCase } from "../../../interfaces/notification/user/IMarkNotificationReadUseCase";


export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string, notificationId: string) {
    return await this._notificationRepository.markAsRead(userId, notificationId);
  }
}
