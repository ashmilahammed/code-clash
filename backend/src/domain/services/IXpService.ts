export interface IXpService {
  getLoginXp(streak: number): number;

  getLevelInfo(xp: number): {
    level: number;
    nextLevelXp: number;
  };

}



