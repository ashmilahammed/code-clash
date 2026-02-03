export type ChallengeDifficulty = "easy" | "medium" | "hard";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  xpReward: number;
}
