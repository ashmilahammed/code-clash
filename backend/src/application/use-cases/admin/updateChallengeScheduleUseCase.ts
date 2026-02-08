import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";


export class UpdateChallengeScheduleUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) { }

  async execute(
    challengeId: string,
    schedule: {
      availableFrom?: Date | null;
      availableUntil?: Date | null;
    }
  ): Promise<void> {

    if (
      schedule.availableFrom &&
      schedule.availableUntil &&
      schedule.availableUntil < schedule.availableFrom
    ) {
      throw new Error("INVALID_SCHEDULE_RANGE");
    }


    await this._challengeRepo.updateSchedule(challengeId, schedule);
  }
}