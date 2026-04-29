import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";

export interface IListAdminChallengesUseCase {
  execute(query: ListQuery): Promise<PaginatedResult<Challenge>>;
}
