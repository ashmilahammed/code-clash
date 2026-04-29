import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";
import { IListChallengesUseCase } from "../../../interfaces/challenge/user/IListChallengesUseCase";


export class ListChallengesUseCase implements IListChallengesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(
    query: ListQuery
  ): Promise<PaginatedResult<Challenge>> {
    return this._challengeRepo.findAll({
      ...query,
      // active challenges
      filters: {
        isActive: true,
      },
    });
  }
}
