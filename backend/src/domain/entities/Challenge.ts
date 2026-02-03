// export type ChallengeDifficulty = "easy" | "medium" | "hard";

// export interface IChallenge {
//   id?: string;

//   title: string;
//   description: string;

//   difficulty: ChallengeDifficulty;
//   xpReward: number;

//   isActive: boolean;

//   createdAt?: Date;
//   updatedAt?: Date;
// }


export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeDomain =
  | "javascript"
  | "python"
  | "algorithm"
  | "database"
  | "network";

export interface IChallenge {
  id?: string;

  title: string;
  description: string;

  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;

  xpReward: number;
  timeLimitMinutes: number;

  starterCode?: string | null;

  isPremium: boolean;
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
