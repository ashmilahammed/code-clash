export class ChallengeHint {
  constructor(
    public readonly id: string | undefined,
    public readonly challengeId: string,
    public order: number,
    public content: string,
    public unlockAfterMinutes?: number
  ) {
    this.validate();
  }

  private validate() {
    if (this.order < 1) {
      throw new Error("Hint order must be >= 1");
    }

    if (!this.content || this.content.trim().length === 0) {
      throw new Error("Hint content cannot be empty");
    }

    if (
      this.unlockAfterMinutes !== undefined &&
      this.unlockAfterMinutes < 0
    ) {
      throw new Error("unlockAfterMinutes cannot be negative");
    }
  }
}
