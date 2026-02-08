export type ChallengeDifficulty = "easy" | "medium" | "hard";

// export type ChallengeDomain =
//   | "javascript"
//   | "python"
//   | "algorithm"
//   | "database"
//   | "network";
export type ChallengeDomain =
  | "arrays"
  | "strings"
  | "linked-list"
  | "stack"
  | "queue"
  | "tree"
  | "graph"
  | "dp"
  | "math"
  | "sql";


export type ChallengeStatus = "draft" | "active" | "archived";

export interface IChallenge {
  readonly id?: string;

  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;

  xpReward: number;
  // timeLimitMinutes?: number;
  timeLimitMinutes?: number | undefined;


  isPremium: boolean;
  isActive: boolean;
  status: ChallengeStatus;

  //scheduling
  availableFrom?: Date | null;
  availableUntil?: Date | null;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
