import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";


export class ToggleChallengeStatusUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(
    challengeId: string,
    isActive: boolean
  ): Promise<void> {
    await this._challengeRepo.toggleActive(challengeId, isActive);
  }
}
