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

export class Challenge {
  constructor(
    public readonly id: string | undefined,
    public title: string,
    public description: string,
    public difficulty: ChallengeDifficulty,
    public domain: ChallengeDomain,
    public xpReward: number,
    public timeLimitMinutes: number | undefined,
    public isPremium: boolean,
    public isActive: boolean,
    public status: ChallengeStatus,
    public availableFrom?: Date | null,
    public availableUntil?: Date | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public tags?: any[],
    public languages?: any[]
  ) {
    this.validate();
  }

  private validate() {
    if (this.xpReward <= 0) {
      throw new Error("XP reward must be positive");
    }

    if (
      this.availableFrom &&
      this.availableUntil &&
      this.availableFrom > this.availableUntil
    ) {
      throw new Error("Invalid challenge availability window");
    }
  }

  activate() {
    this.isActive = true;
    this.status = "active";
  }

  archive() {
    this.isActive = false;
    this.status = "archived";
  }

  schedule(from?: Date | null, until?: Date | null) {
    this.availableFrom = from ?? null;
    this.availableUntil = until ?? null;
  }
}






// export interface IChallenge {
//   readonly id?: string;

//   title: string;
//   description: string;
//   difficulty: ChallengeDifficulty;
//   domain: ChallengeDomain;

//   xpReward: number;
//   // timeLimitMinutes?: number;
//   timeLimitMinutes?: number | undefined;


//   isPremium: boolean;
//   isActive: boolean;
//   status: ChallengeStatus;

//   //scheduling
//   availableFrom?: Date | null;
//   availableUntil?: Date | null;

//   readonly createdAt?: Date;
//   readonly updatedAt?: Date;
// }
