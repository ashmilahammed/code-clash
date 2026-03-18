import {
  ChallengeDifficulty,
  ChallengeDomain,
} from "../../../domain/entities/challenge/Challenge";

export interface AdminListChallengesQueryDTO {
  readonly page: number;
  readonly limit: number;

  readonly search?: string | undefined;
  readonly difficulty?: ChallengeDifficulty | undefined;
  readonly domain?: ChallengeDomain | undefined;
  readonly status?: "active" | "blocked" | undefined;
}