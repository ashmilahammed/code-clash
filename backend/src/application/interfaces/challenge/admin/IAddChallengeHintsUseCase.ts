export interface IAddChallengeHintsUseCase {
  execute(
    challengeId: string,
    hints: {
      order: number;
      content: string;
      unlockAfterMinutes?: number;
    }[]
  ): Promise<void>;
}
