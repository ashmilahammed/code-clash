// import { ChallengeDifficulty, ChallengeDomain, ChallengeStatus } from "../../../domain/entities/challenge/Challenge";

// export interface UpdateChallengeDTO {
//     title?: string;
//     description?: string;
//     difficulty?: ChallengeDifficulty;
//     domain?: ChallengeDomain;
//     xpReward?: number;
//     timeLimitMinutes?: number;
//     isPremium?: boolean;
//     isActive?: boolean;
//     status?: ChallengeStatus;
// }


import {
  ChallengeDifficulty,
  ChallengeDomain,
} from "../../../domain/entities/challenge/Challenge";

export interface UpdateChallengeDTO {
  readonly challengeId: string;

  readonly title?: string;
  readonly description?: string;
  readonly difficulty?: ChallengeDifficulty;
  readonly domain?: ChallengeDomain;
  readonly xpReward?: number;
  readonly timeLimitMinutes?: number;
  readonly isPremium?: boolean;
}