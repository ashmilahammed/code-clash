import {
  ChallengeDifficulty,
  ChallengeDomain,
} from "../../../domain/entities/challenge/Challenge";

export interface UserListChallengesQueryDTO {
  readonly page: number;
  readonly limit: number;

  readonly search?: string | undefined;
  readonly difficulty?: ChallengeDifficulty | undefined;
  readonly domain?: ChallengeDomain | undefined;
  readonly isPremium?: boolean | undefined;
}