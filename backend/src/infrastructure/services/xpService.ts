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




// import { IXpService } from "../../domain/services/IXpService";


// export class XpService implements IXpService {

//   calculateLoginXp(streak: number): number {
//     if (streak >= 30) return 50;
//     if (streak >= 7) return 25;
//     if (streak >= 3) return 15;
//     return 10;
//   }

//   calculateChallengeXp(
//     difficulty: "easy" | "medium" | "hard",
//     timeTakenSeconds: number,
//     hintsUsed: number
//   ): number {
//     let baseXp =
//       difficulty === "easy" ? 50 :
//       difficulty === "medium" ? 100 : 200;

//     const timeBonus =
//       timeTakenSeconds < 300 ? 20 :
//       timeTakenSeconds < 600 ? 10 : 0;

//     const hintPenalty = hintsUsed * 10;

//     return Math.max(baseXp + timeBonus - hintPenalty, 10);
//   }

//   calculateLevelFromXp(xp: number): number {
//     return Math.floor(xp / 500) + 1;
//   }
// }
