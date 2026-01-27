export interface IXpService {
  getLoginXp(streak: number): number;

  getLevelInfo(xp: number): {
    level: number;
    nextLevelXp: number;
  };
}



// export interface IXpService {
//   calculateLoginXp(streak: number): number;

//   calculateChallengeXp(
//     difficulty: "easy" | "medium" | "hard",
//     timeTakenSeconds: number,
//     hintsUsed: number
//   ): number;

//   calculateLevelFromXp(xp: number): number;
// }
