import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
import { ListQuery } from "../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../domain/types/PaginatedResult";
import { IChallenge } from "../../../domain/entities/Challenge";



export class ListAdminChallengesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(
    query: ListQuery
  ): Promise<PaginatedResult<IChallenge>> {
    return this._challengeRepo.findAll(query);
  }
}
