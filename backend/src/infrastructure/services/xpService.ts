import { IXpService } from "../../domain/services/IXpService";

export class XpService implements IXpService {
  private readonly XP_PER_LEVEL = 1000;

  getLevelInfo(xp: number) {
    const level = Math.floor(xp / this.XP_PER_LEVEL) + 1;
    const nextLevelXp = level * this.XP_PER_LEVEL;

    return {
      level,
      nextLevelXp,
    };
  }

  getLoginXp(streak: number): number {
    if (streak >= 30) return 100;
    if (streak >= 14) return 50;
    if (streak >= 7) return 25;
    return 10;
  }
}



