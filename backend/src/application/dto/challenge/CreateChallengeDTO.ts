import { ChallengeDifficulty,ChallengeDomain } from "../../../domain/entities/Challenge";

export interface CreateChallengeDTO {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;
  xpReward: number;
  timeLimitMinutes?: number;
  isPremium?: boolean;
}
