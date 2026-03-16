// import { ChallengeDifficulty, ChallengeDomain, ChallengeStatus } from "../../../domain/entities/challenge/Challenge";

// export interface ChallengeResponseDTO {
//     id: string;
//     title: string;
//     description: string;
//     difficulty: ChallengeDifficulty;
//     domain: ChallengeDomain;
//     xpReward: number;
//     timeLimitMinutes?: number;
//     isPremium: boolean;
//     isActive: boolean;
//     status: ChallengeStatus;
// }


import {
  ChallengeDifficulty,
  ChallengeDomain,
  ChallengeStatus,
} from "../../../domain/entities/challenge/Challenge";

export interface ChallengeResponseDTO {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: ChallengeDifficulty;
  readonly domain: ChallengeDomain;
  readonly xpReward: number;
  readonly timeLimitMinutes?: number;
  readonly isPremium: boolean;
  readonly isActive: boolean;
  readonly status: ChallengeStatus;

  readonly availableFrom?: Date | null;
  readonly availableUntil?: Date | null;

  readonly tags?: string[];
  readonly languages?: string[];
}