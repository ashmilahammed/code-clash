// import { ChallengeDifficulty,ChallengeDomain } from "../../../domain/entities/challenge/Challenge";

// export interface GetChallengeQueryDTO {
//   page: number;
//   limit: number;

//   search?: string;
//   difficulty?: ChallengeDifficulty;
//   domain?: ChallengeDomain;

//   isPremium?: boolean;
// }

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