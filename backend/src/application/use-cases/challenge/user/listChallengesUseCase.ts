import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";


export class ListChallengesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(
    query: ListQuery
  ): Promise<PaginatedResult<Challenge>> {
    return this._challengeRepo.findAll({
      ...query,
      // user should only see active challenges
      filters: {
        isActive: true,
      },
    });
  }
}
