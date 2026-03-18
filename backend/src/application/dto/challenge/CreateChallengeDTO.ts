import {
  ChallengeDifficulty,
  ChallengeDomain,
} from "../../../domain/entities/challenge/Challenge";

export interface CreateChallengeDTO {
  readonly title: string;
  readonly description: string;
  readonly difficulty: ChallengeDifficulty;
  readonly domain: ChallengeDomain;
  readonly xpReward: number;
  readonly timeLimitMinutes?: number;
  readonly isPremium?: boolean;
}