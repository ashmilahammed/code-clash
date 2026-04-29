import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";
import { IListAdminChallengesUseCase } from "../../../interfaces/challenge/admin/IListAdminChallengesUseCase";


export class ListAdminChallengesUseCase implements IListAdminChallengesUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository
  ) {}

  async execute(
    query: ListQuery
  ): Promise<PaginatedResult<Challenge>> {
    return this._challengeRepo.findAll(query);
  }
}
