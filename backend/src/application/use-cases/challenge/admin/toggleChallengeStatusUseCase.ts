import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";
import { ToggleChallengeDTO } from "../../../dto/challenge/ToggleChallengeDTO";

export class ToggleChallengeStatusUseCase {

  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _notificationRepo: INotificationRepository
  ) {}

  async execute(dto: ToggleChallengeDTO, senderId?: string): Promise<void> {

    const { challengeId, isActive } = dto;

    await this._challengeRepo.toggleActive(challengeId, isActive);

    if (isActive) {
      const challenge = await this._challengeRepo.findByIdForUser(challengeId);

      if (challenge) {
        await this._notificationRepo.createNotification({
          title: "🚀 New Challenge Available!",
          message: `Try solving "${challenge.title}".`,
          recipientType: "all",
          senderId: senderId || "000000000000000000000000",
        });
      }
    }
  }
}