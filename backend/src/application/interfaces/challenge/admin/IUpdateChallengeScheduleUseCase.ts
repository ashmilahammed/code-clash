export interface IUpdateChallengeScheduleUseCase {
  execute(
    challengeId: string,
    schedule: {
      availableFrom?: Date | null;
      availableUntil?: Date | null;
    }
  ): Promise<void>;
}
