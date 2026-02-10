export class Level {
  constructor(
    public readonly id: string | undefined,
    public readonly levelNumber: number,
    public readonly minXp: number,
    public readonly maxXp: number,
    public readonly badgeId?: string | null,
    public readonly title?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate() {
    if (this.levelNumber <= 0) {
      throw new Error("Level number must be greater than 0");
    }

    if (this.minXp < 0) {
      throw new Error("Minimum XP cannot be negative");
    }

    if (this.minXp >= this.maxXp) {
      throw new Error("minXp must be less than maxXp");
    }
  }

  containsXp(xp: number): boolean {
    return xp >= this.minXp && xp <= this.maxXp;
  }
}
