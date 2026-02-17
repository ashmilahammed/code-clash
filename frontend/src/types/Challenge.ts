export type ChallengeDifficulty = "easy" | "medium" | "hard";


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


// base challenge
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;
  xpReward: number;
  timeLimitMinutes?: number;
  isPremium: boolean;
  isActive: boolean;
  status: ChallengeStatus;
  availableFrom?: string;
  availableUntil?: string;
}


// Extended versions
export interface ChallengeWithRelations extends Challenge {
  tags: string[];
  languages: string[];
}

// wizard related
export interface CreateChallengePayload {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;
  xpReward: number;
  timeLimitMinutes?: number;
  isPremium?: boolean;
}


export interface CreateChallengeResponse {
  id: string;
  status: ChallengeStatus;
}


export interface ChallengeWizardStep {
  id: string;
  status: ChallengeStatus;
  currentStep:
  | "basic"
  | "tags"
  | "languages"
  | "templates"
  | "publish";
}