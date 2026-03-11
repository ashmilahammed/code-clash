import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { INotificationRepository } from "../../../../domain/repositories/notification/INotificationRepository";


export class ToggleChallengeStatusUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _notificationRepo: INotificationRepository
  ) {}

  async execute(
    challengeId: string,
    isActive: boolean,
    senderId?: string
  ): Promise<void> {
    await this._challengeRepo.toggleActive(challengeId, isActive);

    if (isActive) {
      const challenge = await this._challengeRepo.findByIdForUser(challengeId);
      if (challenge) {
        await this._notificationRepo.createNotification({
          title: "🚀 New Challenge Available!",
          message: `Try solving "${challenge.title}".`,
          recipientType: "all",
          senderId: senderId || "000000000000000000000000", // Default system ID if sender not provided
        });
      }
    }
  }
}
