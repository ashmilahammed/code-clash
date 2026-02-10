import { ChallengeDifficulty,ChallengeDomain } from "../../../domain/entities/challenge/Challenge";

export interface CreateChallengeDTO {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;
  xpReward: number;
  timeLimitMinutes?: number;
  isPremium?: boolean;
}
